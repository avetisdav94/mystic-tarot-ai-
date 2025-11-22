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

    const card = getRandomCard();
    const spread = getSpreadById('daily');

    const interpretation = await aiService.interpretCard(
      card, 
      spread, 
      spread.positions[0]
    );

    await db.saveSpread(userId, 'daily', 'Карта дня', [card], interpretation);

    const imageUrl = getCardImageUrl(card.id);
    const text = `🌅 *Карта дня*\n\n${card.emoji} *${card.name}*\n_${card.nameEn}_\n\n━━━━━━━━━━━━━━━\n\n${interpretation}`;
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '📖 Подробнее о карте', callback_data: `ref_card:${card.id}` }],
        [{ text: '🔮 Другие расклады', callback_data: 'new_spread' }],
        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
      ]
    };

    if (imageUrl) {
      try {
        await bot.sendPhoto(chatId, imageUrl, {
          caption: text,
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      } catch (photoError) {
        // Если фото не загрузилось - отправляем текст
        logger.warn('Failed to send daily card photo, sending text only');
        await bot.sendMessage(chatId, text, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      }
    } else {
      await bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }

    logger.info(`Daily card sent to user ${userId}: ${card.name}`);
  } catch (error) {
    logger.error('Error in handleDailyCard:', error);
    await bot.sendMessage(chatId, '😔 Произошла ошибка. Попробуйте позже.');
  }
}