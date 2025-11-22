import { MESSAGES } from '../constants/messages.js';
import { getMainKeyboard } from '../keyboards/main.keyboard.js';
import { db } from '../services/database.service.js';
import logger from '../utils/logger.js';

export async function handleStart(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Создаём или получаем пользователя
    await db.getOrCreateUser(userId, {
      username: msg.from.username,
      first_name: msg.from.first_name,
      last_name: msg.from.last_name,
      language_code: msg.from.language_code,
    });

    await db.logEvent(userId, 'bot_started');

    await bot.sendMessage(chatId, MESSAGES.welcome, {
      parse_mode: 'Markdown',
      ...getMainKeyboard()
    });

    logger.info(`User ${userId} started the bot`);
  } catch (error) {
    logger.error('Error in handleStart:', error);
    await bot.sendMessage(chatId, MESSAGES.error);
  }
}

export async function handleMainMenu(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    await bot.editMessageText(MESSAGES.welcome, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      ...getMainKeyboard()
    });
  } catch (error) {
    logger.error('Error in handleMainMenu:', error);
  }
}

export async function handleHelp(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    await bot.editMessageText(MESSAGES.howToUse, {
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
    logger.error('Error in handleHelp:', error);
  }
}