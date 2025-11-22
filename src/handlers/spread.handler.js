import { MESSAGES } from '../constants/messages.js';
import { getSpreadById } from '../constants/spreads.js';
import { getCardById } from '../constants/cards.js';
import { getSpreadsKeyboard, getSpreadConfirmKeyboard } from '../keyboards/spreads.keyboard.js';
import { getCardsKeyboard } from '../keyboards/cards.keyboard.js';
import { getPaymentKeyboard } from '../keyboards/payment.keyboard.js';
import { db } from '../services/database.service.js';
import { aiService } from '../services/ai.service.js';
import { paymentService } from '../services/payment.service.js';
import { SessionManager } from '../utils/session.js';
import logger from '../utils/logger.js';

export async function handleNewSpread(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    await bot.editMessageText(MESSAGES.selectSpread, {
      chat_id: chatId,
      message_id: messageId,
      ...getSpreadsKeyboard()
    });
  } catch (error) {
    logger.error('Error in handleNewSpread:', error);
  }
}

export async function handleSpreadSelection(bot, query, spreadId) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  try {
    const spread = getSpreadById(spreadId);
    if (!spread) {
      await bot.answerCallbackQuery(query.id, { text: 'Расклад не найден' });
      return;
    }

    // Проверка премиум доступа
    if (!spread.isFree) {
      const isPremium = await db.isUserPremium(userId);
      if (!isPremium) {
        // Показываем платёжку
        const transaction = await paymentService.createPaymentForSpread(userId, spread);
        
        const text = MESSAGES.needPremium(spread.name, spread.price, spread.currency);
        await bot.editMessageText(text, {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          ...getPaymentKeyboard(transaction.id, spread.price, spread.currency)
        });
        return;
      }
    }

    // Показываем описание и кнопку начала
    const text = `${spread.emoji} *${spread.name}*\n\n${spread.description}\n\n📍 Количество карт: ${spread.cardsCount}\n\n${spread.positions.map(p => `${p.number}. ${p.name} - ${p.description}`).join('\n')}`;

    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      ...getSpreadConfirmKeyboard(spreadId)
    });
  } catch (error) {
    logger.error('Error in handleSpreadSelection:', error);
  }
}

export async function handleStartSpread(bot, query, spreadId) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  try {
    const spread = getSpreadById(spreadId);
    
    // Инициализируем сессию
    SessionManager.updateSession(userId, {
      currentSpread: spreadId,
      selectedCards: [],
      currentPosition: 0,
    });

    await db.logEvent(userId, 'spread_started', { spread_id: spreadId });

    const position = spread.positions[0];
    const text = MESSAGES.selectCard(1, position.name, spread.cardsCount);

    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      ...getCardsKeyboard(0, spreadId)
    });
  } catch (error) {
    logger.error('Error in handleStartSpread:', error);
  }
}

export async function handleCardSelection(bot, query, spreadId, cardId) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  try {
    const spread = getSpreadById(spreadId);
    const card = getCardById(cardId);
    const session = SessionManager.getSession(userId);

    if (!card) {
      await bot.answerCallbackQuery(query.id, { text: 'Карта не найдена' });
      return;
    }

    // Добавляем карту в сессию
    SessionManager.addCard(userId, card);

    await bot.answerCallbackQuery(query.id, { 
      text: `✅ ${card.name} выбрана!` 
    });

    // Проверяем, все ли карты выбраны
    if (session.selectedCards.length >= spread.cardsCount) {
      // Все карты выбраны - получаем толкование
      await handleSpreadComplete(bot, chatId, messageId, userId, spread, session.selectedCards);
    } else {
      // Запрашиваем следующую карту
      const nextPosition = spread.positions[session.currentPosition];
      const text = MESSAGES.selectCard(
        session.currentPosition + 1,
        nextPosition.name,
        spread.cardsCount
      );

      await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        ...getCardsKeyboard(0, spreadId)
      });
    }
  } catch (error) {
    logger.error('Error in handleCardSelection:', error);
    await bot.sendMessage(chatId, MESSAGES.error);
  }
}

async function handleSpreadComplete(bot, chatId, messageId, userId, spread, cards) {
  try {
    // Показываем сообщение о обработке
    await bot.editMessageText(MESSAGES.processing, {
      chat_id: chatId,
      message_id: messageId,
    });

    // Получаем толкование от AI
    const interpretation = await aiService.interpretSpread(cards, spread);

    // Сохраняем в БД
    await db.saveSpread(userId, spread.id, spread.name, cards, interpretation);

    // Очищаем сессию
    SessionManager.clearSession(userId);

    // Формируем итоговое сообщение
    let resultText = `${MESSAGES.spreadComplete}\n\n`;
    resultText += `${spread.emoji} *${spread.name}*\n\n`;
    resultText += `🃏 *Ваши карты:*\n`;
    cards.forEach((card, index) => {
      const pos = spread.positions[index];
      resultText += `${index + 1}. ${pos.name}: ${card.emoji} ${card.name}\n`;
    });
    resultText += `\n━━━━━━━━━━━━━━━\n\n`;
    resultText += interpretation;

    await bot.editMessageText(resultText, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔮 Новый расклад', callback_data: 'new_spread' }],
          [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    });

    logger.info(`Spread completed for user ${userId}: ${spread.id}`);
  } catch (error) {
    logger.error('Error in handleSpreadComplete:', error);
    await bot.sendMessage(chatId, MESSAGES.error);
  }
}

export async function handleCancelSpread(bot, query) {
  const userId = query.from.id;
  SessionManager.clearSession(userId);
  await handleMainMenu(bot, query);
}

function handleMainMenu(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  
  bot.editMessageText(MESSAGES.welcome, {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔮 Новый расклад', callback_data: 'new_spread' }],
        [{ text: '📚 История', callback_data: 'history' }, { text: '📊 Статистика', callback_data: 'stats' }],
        [{ text: '💎 Премиум', callback_data: 'premium' }, { text: 'ℹ️ Помощь', callback_data: 'help' }]
      ]
    }
  });
}