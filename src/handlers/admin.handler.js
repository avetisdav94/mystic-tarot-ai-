import { db } from '../services/database.service.js';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

export async function handleStats(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  // Проверка прав админа
  if (!config.adminIds.includes(userId)) {
    await bot.sendMessage(chatId, '❌ У вас нет доступа к этой команде.');
    return;
  }

  try {
    const stats = await db.getGlobalStats();
    
    const text = `📊 *Статистика бота*\n\n` +
      `👥 Всего пользователей: ${stats.totalUsers}\n` +
      `💎 Премиум пользователей: ${stats.premiumUsers}\n` +
      `🔮 Всего раскладов: ${stats.totalSpreads}\n` +
      `📈 Среднее раскладов на пользователя: ${stats.averageSpreadsPerUser}\n` +
      `🔥 Популярный расклад: ${stats.mostPopularSpread || 'нет данных'}\n\n` +
      `📅 За сегодня:\n` +
      `  • Новых пользователей: ${stats.todayNewUsers}\n` +
      `  • Новых раскладов: ${stats.todaySpreads}`;

    await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    
    logger.info(`Admin stats viewed by user ${userId}`);
  } catch (error) {
    logger.error('Error in handleStats:', error);
    await bot.sendMessage(chatId, '😔 Ошибка получения статистики.');
  }
}

export async function handleBroadcast(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!config.adminIds.includes(userId)) {
    await bot.sendMessage(chatId, '❌ У вас нет доступа к этой команде.');
    return;
  }

  // Получаем текст после команды
  const text = msg.text.replace('/broadcast', '').trim();
  
  if (!text) {
    await bot.sendMessage(chatId, 'Использование: /broadcast <текст сообщения>');
    return;
  }

  try {
    const users = await db.getAllUsers();
    let sent = 0;
    let failed = 0;

    await bot.sendMessage(chatId, `📢 Начинаю рассылку для ${users.length} пользователей...`);

    for (const user of users) {
      try {
        await bot.sendMessage(user.id, text, { parse_mode: 'Markdown' });
        sent++;
        
        // Задержка чтобы не словить rate limit
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        failed++;
        logger.error(`Failed to send broadcast to user ${user.id}:`, error.message);
      }
    }

    await bot.sendMessage(chatId, 
      `✅ Рассылка завершена!\n\n` +
      `📤 Отправлено: ${sent}\n` +
      `❌ Ошибок: ${failed}`
    );

    logger.info(`Broadcast sent by admin ${userId}: ${sent} success, ${failed} failed`);
  } catch (error) {
    logger.error('Error in handleBroadcast:', error);
    await bot.sendMessage(chatId, '😔 Ошибка при рассылке.');
  }
}