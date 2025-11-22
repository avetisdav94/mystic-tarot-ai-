import { MESSAGES } from '../constants/messages.js';
import { db } from '../services/database.service.js';
import { paymentService } from '../services/payment.service.js';
import { getSpreadById } from '../constants/spreads.js';
import logger from '../utils/logger.js';

export async function handlePremium(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const keyboard = [
    [
      { 
        text: '⭐ Подписка 1 месяц - 150 Stars', 
        callback_data: 'buy_subscription:1:150' 
      }
    ],
    [
      { 
        text: '⭐ Подписка 3 месяца - 400 Stars', 
        callback_data: 'buy_subscription:3:400' 
      }
    ],
    [
      { 
        text: '⭐ Подписка 12 месяцев - 1440 Stars', 
        callback_data: 'buy_subscription:12:1440' 
      }
    ],
    [
      { text: '◀️ Назад', callback_data: 'main_menu' }
    ]
  ];

  try {
    await bot.editMessageText(MESSAGES.premium, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    });
  } catch (error) {
    logger.error('Error in handlePremium:', error);
  }
}

export async function handleBuySubscription(bot, query, months, stars) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;

  try {
    // Создаем Invoice для Telegram Stars
    await bot.sendInvoice(
      chatId,
      `Премиум подписка ${months} мес.`,
      `Безлимитный доступ ко всем раскладам Таро на ${months} месяц(а)`,
      `premium_${months}m_${userId}_${Date.now()}`, // payload
      '', // provider_token (пусто для Stars)
      'XTR', // currency - Telegram Stars
      [{ label: `Подписка ${months} мес.`, amount: stars }],
      {
        need_name: false,
        need_phone_number: false,
        need_email: false,
        need_shipping_address: false,
        is_flexible: false,
      }
    );

    await bot.answerCallbackQuery(query.id, { 
      text: '💫 Счет отправлен!' 
    });

    logger.info(`Invoice sent to user ${userId}: ${months} months for ${stars} stars`);
  } catch (error) {
    logger.error('Error in handleBuySubscription:', error);
    await bot.answerCallbackQuery(query.id, { 
      text: 'Ошибка создания счета' 
    });
  }
}

export async function handleBuySpread(bot, query, spreadId) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  
  const spread = getSpreadById(spreadId);
  if (!spread) return;

  // 1 PLN ≈ 10 Stars (примерно)
  const stars = Math.round(spread.price * 10);

  try {
    await bot.sendInvoice(
      chatId,
      spread.name,
      spread.description,
      `spread_${spreadId}_${userId}_${Date.now()}`,
      '',
      'XTR',
      [{ label: spread.name, amount: stars }],
      {
        need_name: false,
        need_phone_number: false,
        need_email: false,
        need_shipping_address: false,
        is_flexible: false,
      }
    );

    await bot.answerCallbackQuery(query.id, { 
      text: '💫 Счет отправлен!' 
    });
  } catch (error) {
    logger.error('Error in handleBuySpread:', error);
  }
}