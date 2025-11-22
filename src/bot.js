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
import { handlePremium, handleSubscribe, handlePayment } from './handlers/payment.handler.js';

export function createBot() {
  const bot = new TelegramBot(config.telegram.token, { polling: true });

  // ============ КОМАНДЫ ============
  
  bot.onText(/\/start/, (msg) => handleStart(bot, msg));
  
  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Используйте /start для начала работы');
  });

  // ============ CALLBACK QUERIES ============
  
  bot.on('callback_query', async (query) => {
    const data = query.data;

    try {
      // Игнорируем служебные кнопки
      if (data === 'ignore') {
        await bot.answerCallbackQuery(query.id);
        return;
      }

      // Главное меню
      if (data === 'main_menu') {
        await handleMainMenu(bot, query);
      }
      
      // Помощь
      else if (data === 'help') {
        await handleHelp(bot, query);
      }
      
      // Новый расклад
      else if (data === 'new_spread') {
        await handleNewSpread(bot, query);
      }
      
      // Выбор расклада
      else if (data.startsWith('select_spread:')) {
        const spreadId = data.split(':')[1];
        await handleSpreadSelection(bot, query, spreadId);
      }
      
      // Начать расклад
      else if (data.startsWith('start_spread:')) {
        const spreadId = data.split(':')[1];
        await handleStartSpread(bot, query, spreadId);
      }
      
      // Выбор карты
      else if (data.startsWith('card_selected:')) {
        const parts = data.split(':');
        const spreadId = parts[1];
        const cardId = parts[2];
        await handleCardSelection(bot, query, spreadId, cardId);
      }

      // Отмена расклада
      else if (data === 'cancel_spread') {
        await handleCancelSpread(bot, query);
      }
      
      // История
      else if (data === 'history') {
        await handleHistory(bot, query);
      }
      
      // Просмотр расклада
      else if (data.startsWith('view_spread:')) {
        const spreadId = data.split(':')[1];
        await handleViewSpread(bot, query, spreadId);
      }
      
      // Статистика
      else if (data === 'stats') {
        await handleStats(bot, query);
      }
      
      // Премиум
      else if (data === 'premium') {
        await handlePremium(bot, query);
      }
      
      // Подписка
      else if (data.startsWith('subscribe:')) {
        const months = parseInt(data.split(':')[1]);
        await handleSubscribe(bot, query, months);
      }
      
      // Оплата
      else if (data.startsWith('pay:')) {
        const transactionId = data.split(':')[1];
        await handlePayment(bot, query, transactionId);
      }
      
      // Неизвестная команда
      else {
        await bot.answerCallbackQuery(query.id);
      }
      
    } catch (error) {
      logger.error('Error handling callback query:', error);
      await bot.answerCallbackQuery(query.id, { 
        text: 'Произошла ошибка. Попробуйте снова.' 
      });
    }
  });

  // ============ ОБРАБОТКА ОШИБОК ============
  
  bot.on('polling_error', (error) => {
    logger.error('Polling error:', error);
  });

  bot.on('error', (error) => {
    logger.error('Bot error:', error);
  });

  return bot;
}