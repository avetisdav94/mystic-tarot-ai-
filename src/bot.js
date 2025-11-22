import TelegramBot from 'node-telegram-bot-api';
import { config } from './config/env.js';
import logger from './utils/logger.js';

// Handlers
import { handleStart, handleMainMenu, handleHelp } from './handlers/start.handler.js';
import { 
  handleNewSpread, 
  handleSpreadSelection, 
  handleStartSpread,
  handleCardSelection,
  handleCancelSpread
} from './handlers/spread.handler.js';
import { handleHistory, handleViewSpread, handleStats } from './handlers/history.handler.js';
import { 
  handlePremium, 
  handleBuySubscription,
  handleBuySpread
} from './handlers/payment.handler.js';
import {
  handleReference,
  handleReferenceSuit,
  handleReferenceCard
} from './handlers/reference.handler.js';

export function createBot() {
  const bot = new TelegramBot(config.telegram.token, { polling: true });

  logger.info('Bot instance created');

  // ============================================
  // КОМАНДЫ
  // ============================================
  
  bot.onText(/\/start/, (msg) => {
    logger.info(`/start command from user ${msg.from.id}`);
    handleStart(bot, msg);
  });
  
  bot.onText(/\/help/, (msg) => {
    logger.info(`/help command from user ${msg.from.id}`);
    bot.sendMessage(msg.chat.id, 'Используйте /start для начала работы с ботом 🔮');
  });

  bot.onText(/\/reference/, (msg) => {
    logger.info(`/reference command from user ${msg.from.id}`);
    bot.sendMessage(msg.chat.id, 'Открываю справочник карт...', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📖 Открыть справочник', callback_data: 'reference' }]
        ]
      }
    });
  });

  // ============================================
  // CALLBACK QUERIES (кнопки)
  // ============================================
  
  bot.on('callback_query', async (query) => {
    const data = query.data;
    const userId = query.from.id;

    logger.info(`Callback query from user ${userId}: ${data}`);

    try {
      // ========== ИГНОРИРУЕМЫЕ КНОПКИ ==========
      if (data === 'ignore') {
        await bot.answerCallbackQuery(query.id);
        return;
      }

      // ========== ГЛАВНОЕ МЕНЮ ==========
      else if (data === 'main_menu') {
        await handleMainMenu(bot, query);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== ПОМОЩЬ ==========
      else if (data === 'help') {
        await handleHelp(bot, query);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== НОВЫЙ РАСКЛАД ==========
      else if (data === 'new_spread') {
        await handleNewSpread(bot, query);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== ВЫБОР РАСКЛАДА ==========
      else if (data.startsWith('select_spread:')) {
        const spreadId = data.split(':')[1];
        await handleSpreadSelection(bot, query, spreadId);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== НАЧАТЬ РАСКЛАД ==========
      else if (data.startsWith('start_spread:')) {
        const spreadId = data.split(':')[1];
        await handleStartSpread(bot, query, spreadId);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== ВЫБОР КАРТЫ ==========
      else if (data.startsWith('card_selected:')) {
        const parts = data.split(':');
        const spreadId = parts[1];
        const cardId = parts[2];
        await handleCardSelection(bot, query, spreadId, cardId);
      }

      // ========== ПАГИНАЦИЯ КАРТ ==========
      else if (data.startsWith('cards_page:')) {
        const parts = data.split(':');
        const spreadId = parts[1];
        const page = parseInt(parts[2]);
        
        const { getCardsKeyboard } = await import('./keyboards/cards.keyboard.js');
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        
        await bot.editMessageReplyMarkup(
          getCardsKeyboard(page, spreadId).reply_markup,
          {
            chat_id: chatId,
            message_id: messageId
          }
        );
        await bot.answerCallbackQuery(query.id);
      }

      // ========== МЛАДШИЕ АРКАНЫ ==========
      else if (data.startsWith('minor_arcana:')) {
        const spreadId = data.split(':')[1];
        const { getMinorArcanaKeyboard } = await import('./keyboards/cards.keyboard.js');
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        
        await bot.editMessageText('🃏 Выберите масть младших арканов:', {
          chat_id: chatId,
          message_id: messageId,
          ...getMinorArcanaKeyboard(spreadId, 'cups')
        });
        await bot.answerCallbackQuery(query.id);
      }

      // ========== ПЕРЕКЛЮЧЕНИЕ МАСТИ ==========
      else if (data.startsWith('suit:')) {
        const parts = data.split(':');
        const spreadId = parts[1];
        const suit = parts[2];
        
        const { getMinorArcanaKeyboard } = await import('./keyboards/cards.keyboard.js');
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        
        await bot.editMessageReplyMarkup(
          getMinorArcanaKeyboard(spreadId, suit).reply_markup,
          {
            chat_id: chatId,
            message_id: messageId
          }
        );
        await bot.answerCallbackQuery(query.id);
      }

      // ========== К СТАРШИМ АРКАНАМ ==========
      else if (data.startsWith('major_arcana:')) {
        const spreadId = data.split(':')[1];
        const { getCardsKeyboard } = await import('./keyboards/cards.keyboard.js');
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        
        await bot.editMessageText('🃏 Выберите карту из Старших Арканов:', {
          chat_id: chatId,
          message_id: messageId,
          ...getCardsKeyboard(0, spreadId)
        });
        await bot.answerCallbackQuery(query.id);
      }

      // ========== ОТМЕНА РАСКЛАДА ==========
      else if (data === 'cancel_spread') {
        await handleCancelSpread(bot, query);
        await bot.answerCallbackQuery(query.id, { text: '🏠 Возврат в меню' });
      }
      
      // ========== ИСТОРИЯ ==========
      else if (data === 'history') {
        await handleHistory(bot, query);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== ПРОСМОТР РАСКЛАДА ==========
      else if (data.startsWith('view_spread:')) {
        const spreadId = data.split(':')[1];
        await handleViewSpread(bot, query, spreadId);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== СТАТИСТИКА ==========
      else if (data === 'stats') {
        await handleStats(bot, query);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== ПРЕМИУМ ==========
      else if (data === 'premium') {
        await handlePremium(bot, query);
        await bot.answerCallbackQuery(query.id);
      }
      
      // ========== ПОКУПКА ПОДПИСКИ ==========
      else if (data.startsWith('buy_subscription:')) {
        const parts = data.split(':');
        const months = parseInt(parts[1]);
        const stars = parseInt(parts[2]);
        await handleBuySubscription(bot, query, months, stars);
      }

      // ========== ПОКУПКА РАСКЛАДА ==========
      else if (data.startsWith('buy_spread:')) {
        const spreadId = data.split(':')[1];
        await handleBuySpread(bot, query, spreadId);
      }

      // ========== СПРАВОЧНИК ==========
      else if (data === 'reference') {
        await handleReference(bot, query);
        await bot.answerCallbackQuery(query.id);
      }

      // ========== СПРАВОЧНИК ПО МАСТИ ==========
      else if (data.startsWith('ref_') && !data.includes(':')) {
        const suit = data.replace('ref_', '');
        await handleReferenceSuit(bot, query, suit);
        await bot.answerCallbackQuery(query.id);
      }

      // ========== КОНКРЕТНАЯ КАРТА В СПРАВОЧНИКЕ ==========
      else if (data.startsWith('ref_card:')) {
        const cardId = data.split(':')[1];
        await handleReferenceCard(bot, query, cardId);
        await bot.answerCallbackQuery(query.id);
      }

      // ========== ТЕСТОВЫЙ ПРЕМИУМ ==========
      else if (data.startsWith('subscribe:')) {
        const months = parseInt(data.split(':')[1]);
        const { db } = await import('./services/database.service.js');
        await db.grantPremium(userId, months);
        
        await bot.answerCallbackQuery(query.id, { 
          text: `✅ Тестовый премиум на ${months} мес. активирован!`, 
          show_alert: true 
        });

        const chatId = query.message.chat.id;
        await bot.sendMessage(chatId, 
          `🎉 *Премиум активирован!*\n\nВам предоставлен доступ на ${months} месяц(ев).\n\nТеперь вам доступны все расклады!`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔮 Попробовать премиум расклад', callback_data: 'new_spread' }],
                [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
              ]
            }
          }
        );
      }
      
      // ========== НЕИЗВЕСТНАЯ КОМАНДА ==========
      else {
        logger.warn(`Unknown callback data: ${data}`);
        await bot.answerCallbackQuery(query.id, {
          text: '❓ Неизвестная команда'
        });
      }
      
    } catch (error) {
      logger.error('Error handling callback query:', error);
      
      try {
        await bot.answerCallbackQuery(query.id, { 
          text: '😔 Произошла ошибка. Попробуйте снова.',
          show_alert: true
        });
      } catch (answerError) {
        logger.error('Error answering callback query:', answerError);
      }

      try {
        await bot.sendMessage(query.message.chat.id, 
          '😔 Произошла ошибка. Попробуйте начать заново с /start'
        );
      } catch (sendError) {
        logger.error('Error sending error message:', sendError);
      }
    }
  });

  // ============================================
  // ПЛАТЕЖИ (Telegram Stars)
  // ============================================

  bot.on('pre_checkout_query', async (query) => {
    logger.info(`Pre-checkout query from user ${query.from.id}`);
    
    try {
      await bot.answerPreCheckoutQuery(query.id, true);
      logger.info(`Pre-checkout approved for user ${query.from.id}`);
    } catch (error) {
      logger.error('Pre-checkout error:', error);
      await bot.answerPreCheckoutQuery(query.id, false, {
        error_message: 'Произошла ошибка при обработке платежа'
      });
    }
  });

  bot.on('successful_payment', async (msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const payment = msg.successful_payment;
    const payload = payment.invoice_payload;

    logger.info(`Successful payment from user ${userId}: ${payload}`);

    try {
      const { db } = await import('./services/database.service.js');

      if (payload.startsWith('premium_')) {
        const parts = payload.split('_');
        const months = parseInt(parts[1].replace('m', ''));
        
        await db.grantPremium(userId, months);
        
        await db.logEvent(userId, 'premium_purchased', {
          months,
          amount: payment.total_amount,
          currency: payment.currency,
          payload
        });

        await bot.sendMessage(chatId,
          `🎉 *Поздравляем с покупкой!*\n\n✨ Премиум подписка на *${months} месяц(ев)* успешно активирована!\n\n` +
          `Теперь вам доступны:\n` +
          `✅ Все премиум расклады\n` +
          `✅ Безлимитная история\n` +
          `✅ Приоритетная поддержка\n\n` +
          `Спасибо за поддержку! 💖`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔮 Попробовать премиум расклад', callback_data: 'new_spread' }],
                [{ text: '📖 Справочник карт', callback_data: 'reference' }],
                [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
              ]
            }
          }
        );

        logger.info(`Premium granted to user ${userId} for ${months} months`);

      } else if (payload.startsWith('spread_')) {
        const parts = payload.split('_');
        const spreadId = parts[1];
        
        await db.logEvent(userId, 'spread_purchased', {
          spread_id: spreadId,
          amount: payment.total_amount,
          currency: payment.currency,
          payload
        });

        await bot.sendMessage(chatId,
          `✅ *Оплата принята!*\n\n` +
          `Теперь вы можете сделать этот расклад.\n\n` +
          `Нажмите кнопку ниже, чтобы начать:`,
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔮 Начать расклад', callback_data: `start_spread:${spreadId}` }],
                [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
              ]
            }
          }
        );

        logger.info(`Spread purchase confirmed for user ${userId}: ${spreadId}`);
      } else {
        logger.warn(`Unknown payment payload: ${payload}`);
        
        await bot.sendMessage(chatId,
          `✅ Оплата получена!\n\nСпасибо за покупку! 💖`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
              ]
            }
          }
        );
      }

    } catch (error) {
      logger.error('Error handling successful payment:', error);
      
      await bot.sendMessage(chatId,
        `⚠️ Оплата получена, но возникла техническая ошибка.\n\n` +
        `Пожалуйста, обратитесь в поддержку: @your_support`
      );
    }
  });

  // ============================================
  // ОБРАБОТКА ОШИБОК
  // ============================================
  
  bot.on('polling_error', (error) => {
    logger.error('Polling error:', error);
  });

  bot.on('error', (error) => {
    logger.error('Bot error:', error);
  });

  bot.on('message', (msg) => {
    if (msg.text && msg.text.startsWith('/')) {
      return;
    }

    if (msg.text && !msg.successful_payment) {
      logger.info(`Text message from user ${msg.from.id}: ${msg.text}`);
      
      bot.sendMessage(msg.chat.id, 
        'Используйте кнопки меню или команду /start 🔮',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
          }
        }
      );
    }
  });

  logger.info('All bot handlers registered');

  return bot;
}