// Бесплатный источник изображений Rider-Waite Tarot
const TAROT_IMAGES_BASE = 'https://raw.githubusercontent.com/dariusk/tarot-cards/master/card-images';

// Маппинг наших ID на имена файлов
const cardImageMap = {
  // Major Arcana
  'major_0': 'major00.jpg',
  'major_1': 'major01.jpg',
  'major_2': 'major02.jpg',
  'major_3': 'major03.jpg',
  'major_4': 'major04.jpg',
  'major_5': 'major05.jpg',
  'major_6': 'major06.jpg',
  'major_7': 'major07.jpg',
  'major_8': 'major08.jpg',
  'major_9': 'major09.jpg',
  'major_10': 'major10.jpg',
  'major_11': 'major11.jpg',
  'major_12': 'major12.jpg',
  'major_13': 'major13.jpg',
  'major_14': 'major14.jpg',
  'major_15': 'major15.jpg',
  'major_16': 'major16.jpg',
  'major_17': 'major17.jpg',
  'major_18': 'major18.jpg',
  'major_19': 'major19.jpg',
  'major_20': 'major20.jpg',
  'major_21': 'major21.jpg',
  
  // Cups
  'cups_ace': 'cups01.jpg',
  'cups_2': 'cups02.jpg',
  'cups_3': 'cups03.jpg',
  'cups_4': 'cups04.jpg',
  'cups_5': 'cups05.jpg',
  'cups_6': 'cups06.jpg',
  'cups_7': 'cups07.jpg',
  'cups_8': 'cups08.jpg',
  'cups_9': 'cups09.jpg',
  'cups_10': 'cups10.jpg',
  'cups_page': 'cups11.jpg',
  'cups_knight': 'cups12.jpg',
  'cups_queen': 'cups13.jpg',
  'cups_king': 'cups14.jpg',
  
  // Wands
  'wands_ace': 'wands01.jpg',
  'wands_2': 'wands02.jpg',
  'wands_3': 'wands03.jpg',
  'wands_4': 'wands04.jpg',
  'wands_5': 'wands05.jpg',
  'wands_6': 'wands06.jpg',
  'wands_7': 'wands07.jpg',
  'wands_8': 'wands08.jpg',
  'wands_9': 'wands09.jpg',
  'wands_10': 'wands10.jpg',
  'wands_page': 'wands11.jpg',
  'wands_knight': 'wands12.jpg',
  'wands_queen': 'wands13.jpg',
  'wands_king': 'wands14.jpg',
  
  // Swords
  'swords_ace': 'swords01.jpg',
  'swords_2': 'swords02.jpg',
  'swords_3': 'swords03.jpg',
  'swords_4': 'swords04.jpg',
  'swords_5': 'swords05.jpg',
  'swords_6': 'swords06.jpg',
  'swords_7': 'swords07.jpg',
  'swords_8': 'swords08.jpg',
  'swords_9': 'swords09.jpg',
  'swords_10': 'swords10.jpg',
  'swords_page': 'swords11.jpg',
  'swords_knight': 'swords12.jpg',
  'swords_queen': 'swords13.jpg',
  'swords_king': 'swords14.jpg',
  
  // Pentacles
  'pentacles_ace': 'pents01.jpg',
  'pentacles_2': 'pents02.jpg',
  'pentacles_3': 'pents03.jpg',
  'pentacles_4': 'pents04.jpg',
  'pentacles_5': 'pents05.jpg',
  'pentacles_6': 'pents06.jpg',
  'pentacles_7': 'pents07.jpg',
  'pentacles_8': 'pents08.jpg',
  'pentacles_9': 'pents09.jpg',
  'pentacles_10': 'pents10.jpg',
  'pentacles_page': 'pents11.jpg',
  'pentacles_knight': 'pents12.jpg',
  'pentacles_queen': 'pents13.jpg',
  'pentacles_king': 'pents14.jpg',
};

/**
 * Получить URL изображения карты
 * @param {string} cardId - ID карты (например, 'major_0', 'cups_ace')
 * @returns {string} URL изображения
 */
export function getCardImageUrl(cardId) {
  const filename = cardImageMap[cardId];
  if (!filename) {
    console.warn(`No image found for card: ${cardId}`);
    return null;
  }
  return `${TAROT_IMAGES_BASE}/${filename}`;
}

/**
 * Альтернативный источник - Sacred Texts
 */
export function getCardImageUrlAlt(cardId) {
  // Можно использовать другой источник как fallback
  return `https://www.sacred-texts.com/tarot/pkt/img/${cardImageMap[cardId]}`;
}

export default getCardImageUrl;