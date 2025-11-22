import { getRandomCard } from '../constants/cards/index.js';
import { getSpreadById } from '../constants/spreads.js';
import { aiService } from '../services/ai.service.js';
import { db } from '../services/database.service.js';
import { getCardImageUrl } from '../utils/card-images.js';
import logger from '../utils/logger.js';

export async function handleDailyCard(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    await bot.sendMessage(chatId, '🔮 Вытягиваю вашу карту дня...');

    // Вытягиваем случайную карту
    const card = getRandomCard();
    const spread = getSpreadById('daily');

    // Получаем толкование
    const interpretation = await aiService.interpretCard(
      card, 
      spread, 
      spread.positions[0]
    );

    // Сохраняем
    await db.saveSpread(userId, 'daily', 'Карта дня', [card], interpretation);

    // Отправляем с изображением
    const imageUrl = getCardImageUrl(card.id);
    
    if (imageUrl) {
      await bot.sendPhoto(chatId, imageUrl, {
        caption: `🌅 *Карта дня: ${card.name}*\n\n${card.emoji} ${card.nameEn}\n\n━━━━━━━━━━━━━━━\n\n${interpretation}`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📖 Подробнее о карте', callback_data: `ref_card:${card.id}` }],
            [{ text: '🔮 Другие расклады', callback_data: 'new_spread' }],
            [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
          ]
        }
      });
    } else {
      await bot.sendMessage(chatId, 
        `🌅 *Карта дня: ${card.name}*\n\n${card.emoji} ${card.nameEn}\n\n━━━━━━━━━━━━━━━\n\n${interpretation}`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📖 Подробнее о карте', callback_data: `ref_card:${card.id}` }],
              [{ text: '🔮 Другие расклады', callback_data: 'new_spread' }]
            ]
          }
        }
      );
    }

    logger.info(`Daily card sent to user ${userId}: ${card.name}`);
  } catch (error) {
    logger.error('Error in handleDailyCard:', error);
    await bot.sendMessage(chatId, '😔 Произошла ошибка. Попробуйте позже.');
  }
}