import { MESSAGES } from '../constants/messages.js';
import { getMainKeyboard } from '../keyboards/main.keyboard.js';
import { db } from '../services/database.service.js';
import logger from '../utils/logger.js';

export async function handleStart(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const firstName = msg.from.first_name || 'друг';

  try {
    const user = await db.getOrCreateUser(userId, {
      username: msg.from.username,
      first_name: msg.from.first_name,
      last_name: msg.from.last_name,
      language_code: msg.from.language_code,
    });

    await db.logEvent(userId, 'bot_started');

    // Если пользователь новый - полное приветствие
    // Если вернулся - короткое
    const isNewUser = !user || new Date(user.created_at) > new Date(Date.now() - 60000);
    
    const message = isNewUser ? MESSAGES.welcome : MESSAGES.greeting(firstName);

    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      ...getMainKeyboard()
    });

    logger.info(`User ${userId} started the bot (new: ${isNewUser})`);
  } catch (error) {
    logger.error('Error in handleStart:', error);
    await bot.sendMessage(chatId, MESSAGES.error);
  }
}

export async function handleMainMenu(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const firstName = query.from.first_name || 'друг';

  try {
    // Проверяем тип сообщения
    if (query.message.photo) {
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(chatId, MESSAGES.greeting(firstName), {
        parse_mode: 'Markdown',
        ...getMainKeyboard()
      });
    } else {
      await bot.editMessageText(MESSAGES.greeting(firstName), {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        ...getMainKeyboard()
      });
    }
  } catch (error) {
    logger.error('Error in handleMainMenu:', error);
  }
}

export async function handleHelp(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    // Проверяем тип сообщения
    if (query.message.photo) {
      await bot.deleteMessage(chatId, messageId);
      await bot.sendMessage(chatId, MESSAGES.howToUse, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '◀️ Назад', callback_data: 'main_menu' }]
          ]
        }
      });
    } else {
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
    }
  } catch (error) {
    logger.error('Error in handleHelp:', error);
  }
}