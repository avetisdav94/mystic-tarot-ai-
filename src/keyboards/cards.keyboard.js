import { MAJOR_ARCANA, CUPS, ALL_CARDS } from '../constants/cards.js';

export function getCardsKeyboard(page = 0, spreadId) {
  const cardsPerPage = 10;
  const startIndex = page * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  
  const cards = MAJOR_ARCANA.slice(startIndex, endIndex);
  const keyboard = [];

  cards.forEach(card => {
    keyboard.push([{
      text: `${card.emoji} ${card.name}`,
      callback_data: `card_selected:${spreadId}:${card.id}`
    }]);
  });

  // Пагинация
  const navButtons = [];
  if (page > 0) {
    navButtons.push({
      text: '◀️ Назад',
      callback_data: `cards_page:${spreadId}:${page - 1}`
    });
  }
  if (endIndex < MAJOR_ARCANA.length) {
    navButtons.push({
      text: 'Вперёд ▶️',
      callback_data: `cards_page:${spreadId}:${page + 1}`
    });
  }

  if (navButtons.length > 0) {
    keyboard.push(navButtons);
  }

  // Переключение на младшие арканы
  keyboard.push([
    { text: '🃏 Младшие арканы', callback_data: `minor_arcana:${spreadId}` }
  ]);

  keyboard.push([
    { text: '🏠 Главное меню', callback_data: 'cancel_spread' }
  ]);

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

export function getMinorArcanaKeyboard(spreadId, suit = 'cups') {
  const keyboard = [];

  // Кнопки выбора масти
  keyboard.push([
    { text: suit === 'cups' ? '💧 Кубки ✓' : '💧 Кубки', callback_data: `suit:${spreadId}:cups` },
    { text: suit === 'wands' ? '🔥 Жезлы ✓' : '🔥 Жезлы', callback_data: `suit:${spreadId}:wands` },
  ]);
  keyboard.push([
    { text: suit === 'swords' ? '⚔️ Мечи ✓' : '⚔️ Мечи', callback_data: `suit:${spreadId}:swords` },
    { text: suit === 'pentacles' ? '🪙 Пентакли ✓' : '🪙 Пентакли', callback_data: `suit:${spreadId}:pentacles` },
  ]);

  // Карты выбранной масти (пока только кубки как пример)
  if (suit === 'cups') {
    CUPS.forEach(card => {
      keyboard.push([{
        text: `${card.emoji} ${card.name}`,
        callback_data: `card_selected:${spreadId}:${card.id}`
      }]);
    });
  }

  keyboard.push([
    { text: '◀️ К старшим арканам', callback_data: `major_arcana:${spreadId}` }
  ]);

  keyboard.push([
    { text: '🏠 Главное меню', callback_data: 'cancel_spread' }
  ]);

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}