import { MAJOR_ARCANA } from './major-arcana.js';
import { CUPS } from './cups.js';
import { WANDS } from './wands.js';
import { SWORDS } from './swords.js';
import { PENTACLES } from './pentacles.js';

// Объединяем все карты
export const ALL_CARDS = [
  ...MAJOR_ARCANA,
  ...CUPS,
  ...WANDS,
  ...SWORDS,
  ...PENTACLES
];

// Экспортируем отдельные масти
export { MAJOR_ARCANA, CUPS, WANDS, SWORDS, PENTACLES };

// Типы мастей
export const SUIT_TYPES = {
  MAJOR: 'major',
  CUPS: 'cups',
  WANDS: 'wands',
  SWORDS: 'swords',
  PENTACLES: 'pentacles'
};

// Получить карту по ID
export const getCardById = (id) => {
  return ALL_CARDS.find(card => card.id === id);
};

// Получить карты по масти
export const getCardsBySuit = (suit) => {
  return ALL_CARDS.filter(card => card.suit === suit);
};

// Получить случайную карту
export const getRandomCard = () => {
  return ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
};

// Группировка карт для справочника
export const getCardsGrouped = () => {
  return {
    major: MAJOR_ARCANA,
    cups: CUPS,
    wands: WANDS,
    swords: SWORDS,
    pentacles: PENTACLES
  };
};