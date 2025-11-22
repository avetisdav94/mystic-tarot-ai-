// Маппинг ID карт на изображения из Tarot API
const TAROT_API_BASE = 'https://sacred-texts.com/tarot/pkt/img';

export function getCardImage(card) {
  // Используем простую логику для Rider-Waite колоды
  const nameSlug = card.nameEn.toLowerCase().replace(/\s+/g, '');
  
  // Примеры URL (можно использовать разные источники)
  return `${TAROT_API_BASE}/${nameSlug}.jpg`;
}

// Альтернатива - локальные изображения
export function getLocalCardImage(card) {
  return `/images/tarot/${card.id}.jpg`;
}