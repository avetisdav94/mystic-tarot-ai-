import { getCardsGrouped, getCardById } from '../constants/cards/index.js';
import { SUIT_TYPES } from '../constants/cards/index.js';
import logger from '../utils/logger.js';

export async function handleReference(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const keyboard = [
    [{ text: '🌟 Старшие Арканы (22 карты)', callback_data: 'ref_major' }],
    [{ text: '💧 Кубки', callback_data: 'ref_cups' }, { text: '🔥 Жезлы', callback_data: 'ref_wands' }],
    [{ text: '⚔️ Мечи', callback_data: 'ref_swords' }, { text: '🪙 Пентакли', callback_data: 'ref_pentacles' }],
    [{ text: '◀️ Главное меню', callback_data: 'main_menu' }]
  ];

  try {
    await bot.editMessageText(
      '📖 *Справочник Таро*\n\nВыберите масть для изучения карт:',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
      }
    );
  } catch (error) {
    logger.error('Error in handleReference:', error);
  }
}

export async function handleReferenceSuit(bot, query, suit) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const grouped = getCardsGrouped();
  const cards = grouped[suit];

  if (!cards) {
    await bot.answerCallbackQuery(query.id, { text: 'Масть не найдена' });
    return;
  }

  const suitNames = {
    major: '🌟 Старшие Арканы',
    cups: '💧 Кубки',
    wands: '🔥 Жезлы',
    swords: '⚔️ Мечи',
    pentacles: '🪙 Пентакли'
  };

  // Создаем клавиатуру с картами
  const keyboard = [];
  cards.forEach(card => {
    keyboard.push([{
      text: `${card.emoji} ${card.name}`,
      callback_data: `ref_card:${card.id}`
    }]);
  });

  keyboard.push([{ text: '◀️ К мастям', callback_data: 'reference' }]);

  try {
    await bot.editMessageText(
      `${suitNames[suit]}\n\nВсего карт: ${cards.length}\n\nВыберите карту для подробной информации:`,
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: keyboard }
      }
    );
  } catch (error) {
    logger.error('Error in handleReferenceSuit:', error);
  }
}

export async function handleReferenceCard(bot, query, cardId) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const card = getCardById(cardId);

  if (!card) {
    await bot.answerCallbackQuery(query.id, { text: 'Карта не найдена' });
    return;
  }

  let text = `${card.emoji} *${card.name}*\n`;
  text += `_${card.nameEn}_\n\n`;
  
  if (card.number !== undefined) {
    text += `🔢 Номер: ${card.number}\n`;
  }
  
  text += `\n📝 *Описание:*\n${card.description}\n\n`;
  text += `🔑 *Ключевые слова:*\n${card.keywords.join(', ')}\n\n`;
  text += `⬆️ *Прямое положение:*\n${card.uprightMeaning}\n\n`;
  text += `⬇️ *Перевернутое положение:*\n${card.reversedMeaning}`;

  const keyboard = [
    [{ text: '◀️ К списку карт', callback_data: `ref_${card.suit}` }],
    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
  ];

  try {
    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    });
  } catch (error) {
    logger.error('Error in handleReferenceCard:', error);
  }
}