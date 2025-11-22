import { db } from '../services/database.service.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../utils/logger.js';
import dayjs from 'dayjs';
import 'dayjs/locale/ru.js';

dayjs.locale('ru');

export async function handleHistory(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  try {
    const spreads = await db.getUserSpreads(userId, 10);

    if (spreads.length === 0) {
      await bot.editMessageText(MESSAGES.noHistory, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔮 Сделать расклад', callback_data: 'new_spread' }],
            [{ text: '◀️ Назад', callback_data: 'main_menu' }]
          ]
        }
      });
      return;
    }

    const keyboard = spreads.map(spread => [{
      text: `${spread.spread_name} - ${dayjs(spread.created_at).format('DD MMM, HH:mm')}`,
      callback_data: `view_spread:${spread.id}`
    }]);

    keyboard.push([{ text: '◀️ Назад', callback_data: 'main_menu' }]);

    await bot.editMessageText(MESSAGES.history(spreads.length), {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: keyboard
      }
    });
  } catch (error) {
    logger.error('Error in handleHistory:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Ошибка загрузки истории' });
  }
}

export async function handleViewSpread(bot, query, spreadId) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    const spread = await db.getSpreadById(spreadId);

    if (!spread) {
      await bot.answerCallbackQuery(query.id, { text: 'Расклад не найден' });
      return;
    }

    let text = `📅 *${spread.spread_name}*\n`;
    text += `🕐 ${dayjs(spread.created_at).format('DD MMMM YYYY, HH:mm')}\n\n`;
    text += `🃏 *Карты:*\n`;
    spread.cards.forEach((card, index) => {
      text += `${index + 1}. ${card.emoji || '🎴'} ${card.name}\n`;
    });
    text += `\n━━━━━━━━━━━━━━━\n\n`;
    text += spread.interpretation;

    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🗑️ Удалить расклад', callback_data: `delete_spread:${spreadId}` }],
          [{ text: '◀️ К истории', callback_data: 'history' }],
          [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
        ]
      }
    });
  } catch (error) {
    logger.error('Error in handleViewSpread:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Ошибка загрузки расклада' });
  }
}

export async function handleDeleteSpread(bot, query, spreadId) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  try {
    const success = await db.deleteSpread(userId, spreadId);

    if (success) {
      await bot.editMessageText(
        '✅ *Расклад удален*\n\nВы можете вернуться к истории раскладов.',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📚 К истории', callback_data: 'history' }],
              [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
          }
        }
      );

      await bot.answerCallbackQuery(query.id, { text: '✅ Удалено' });
    } else {
      await bot.answerCallbackQuery(query.id, { text: '❌ Ошибка удаления' });
    }
  } catch (error) {
    logger.error('Error in handleDeleteSpread:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Ошибка удаления' });
  }
}

export async function handleStats(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  try {
    const stats = await db.getUserStats(userId);

    const text = MESSAGES.stats(
      stats.totalSpreads,
      stats.mostFrequentCard
    );

    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '◀️ Назад', callback_data: 'main_menu' }]
        ]
      }
    });
  } catch (error) {
    logger.error('Error in handleStats:', error);
  }
}