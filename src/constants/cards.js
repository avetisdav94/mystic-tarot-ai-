export const CARD_TYPES = {
  MAJOR_ARCANA: 'major_arcana',
  CUPS: 'cups',
  WANDS: 'wands',
  SWORDS: 'swords',
  PENTACLES: 'pentacles'
};

export const MAJOR_ARCANA = [
  {
    id: '0',
    name: 'Шут',
    nameEn: 'The Fool',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 0,
    keywords: ['новые начинания', 'спонтанность', 'вера', 'риск'],
    emoji: '🃏'
  },
  {
    id: '1',
    name: 'Маг',
    nameEn: 'The Magician',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 1,
    keywords: ['сила воли', 'проявление', 'мастерство', 'ресурсы'],
    emoji: '🎩'
  },
  {
    id: '2',
    name: 'Верховная Жрица',
    nameEn: 'The High Priestess',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 2,
    keywords: ['интуиция', 'тайна', 'подсознание', 'мудрость'],
    emoji: '🔮'
  },
  {
    id: '3',
    name: 'Императрица',
    nameEn: 'The Empress',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 3,
    keywords: ['изобилие', 'природа', 'красота', 'плодородие'],
    emoji: '👑'
  },
  {
    id: '4',
    name: 'Император',
    nameEn: 'The Emperor',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 4,
    keywords: ['власть', 'структура', 'контроль', 'стабильность'],
    emoji: '🏛️'
  },
  {
    id: '5',
    name: 'Иерофант',
    nameEn: 'The Hierophant',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 5,
    keywords: ['традиции', 'образование', 'духовность', 'мораль'],
    emoji: '⛪'
  },
  {
    id: '6',
    name: 'Влюбленные',
    nameEn: 'The Lovers',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 6,
    keywords: ['любовь', 'выбор', 'гармония', 'союз'],
    emoji: '❤️'
  },
  {
    id: '7',
    name: 'Колесница',
    nameEn: 'The Chariot',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 7,
    keywords: ['победа', 'воля', 'движение', 'контроль'],
    emoji: '🏹'
  },
  {
    id: '8',
    name: 'Сила',
    nameEn: 'Strength',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 8,
    keywords: ['мужество', 'терпение', 'сострадание', 'внутренняя сила'],
    emoji: '🦁'
  },
  {
    id: '9',
    name: 'Отшельник',
    nameEn: 'The Hermit',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 9,
    keywords: ['одиночество', 'поиск', 'мудрость', 'внутренний свет'],
    emoji: '🕯️'
  },
  {
    id: '10',
    name: 'Колесо Фортуны',
    nameEn: 'Wheel of Fortune',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 10,
    keywords: ['судьба', 'изменения', 'циклы', 'удача'],
    emoji: '🎡'
  },
  {
    id: '11',
    name: 'Справедливость',
    nameEn: 'Justice',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 11,
    keywords: ['правда', 'закон', 'баланс', 'ответственность'],
    emoji: '⚖️'
  },
  {
    id: '12',
    name: 'Повешенный',
    nameEn: 'The Hanged Man',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 12,
    keywords: ['жертва', 'новый взгляд', 'отпускание', 'пауза'],
    emoji: '🙃'
  },
  {
    id: '13',
    name: 'Смерть',
    nameEn: 'Death',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 13,
    keywords: ['трансформация', 'конец', 'новое начало', 'освобождение'],
    emoji: '💀'
  },
  {
    id: '14',
    name: 'Умеренность',
    nameEn: 'Temperance',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 14,
    keywords: ['баланс', 'терпение', 'умеренность', 'гармония'],
    emoji: '🧘'
  },
  {
    id: '15',
    name: 'Дьявол',
    nameEn: 'The Devil',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 15,
    keywords: ['зависимость', 'искушение', 'материализм', 'ограничения'],
    emoji: '😈'
  },
  {
    id: '16',
    name: 'Башня',
    nameEn: 'The Tower',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 16,
    keywords: ['разрушение', 'хаос', 'откровение', 'освобождение'],
    emoji: '⚡'
  },
  {
    id: '17',
    name: 'Звезда',
    nameEn: 'The Star',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 17,
    keywords: ['надежда', 'вдохновение', 'исцеление', 'обновление'],
    emoji: '⭐'
  },
  {
    id: '18',
    name: 'Луна',
    nameEn: 'The Moon',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 18,
    keywords: ['иллюзии', 'страхи', 'подсознание', 'интуиция'],
    emoji: '🌙'
  },
  {
    id: '19',
    name: 'Солнце',
    nameEn: 'The Sun',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 19,
    keywords: ['радость', 'успех', 'ясность', 'энергия'],
    emoji: '☀️'
  },
  {
    id: '20',
    name: 'Суд',
    nameEn: 'Judgement',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 20,
    keywords: ['возрождение', 'прощение', 'призвание', 'оценка'],
    emoji: '📯'
  },
  {
    id: '21',
    name: 'Мир',
    nameEn: 'The World',
    type: CARD_TYPES.MAJOR_ARCANA,
    number: 21,
    keywords: ['завершение', 'достижение', 'целостность', 'успех'],
    emoji: '🌍'
  }
];

// Младшие арканы - Кубки
export const CUPS = [
  {
    id: 'cups_ace',
    name: 'Туз Кубков',
    nameEn: 'Ace of Cups',
    type: CARD_TYPES.CUPS,
    keywords: ['новая любовь', 'эмоции', 'духовность', 'творчество'],
    emoji: '🏆'
  },
  {
    id: 'cups_2',
    name: 'Двойка Кубков',
    nameEn: 'Two of Cups',
    type: CARD_TYPES.CUPS,
    keywords: ['партнерство', 'любовь', 'единство', 'взаимность'],
    emoji: '💑'
  },
  // ... добавь остальные карты мастей
];

// Объединяем все карты
export const ALL_CARDS = [
  ...MAJOR_ARCANA,
  ...CUPS,
  // ...WANDS,
  // ...SWORDS,
  // ...PENTACLES,
];

// Поиск карты по ID
export const getCardById = (id) => {
  return ALL_CARDS.find(card => card.id === id);
};

// Получить карты по типу
export const getCardsByType = (type) => {
  return ALL_CARDS.filter(card => card.type === type);
};