/**
 * Tarot API - бесплатный API с изображениями Rider-Waite
 * Docs: https://tarot-api.vercel.app/
 */

// Маппинг наших ID на названия API
const cardApiNames = {
  // Major Arcana
  'major_0': 'ar00',
  'major_1': 'ar01',
  'major_2': 'ar02',
  'major_3': 'ar03',
  'major_4': 'ar04',
  'major_5': 'ar05',
  'major_6': 'ar06',
  'major_7': 'ar07',
  'major_8': 'ar08',
  'major_9': 'ar09',
  'major_10': 'ar10',
  'major_11': 'ar11',
  'major_12': 'ar12',
  'major_13': 'ar13',
  'major_14': 'ar14',
  'major_15': 'ar15',
  'major_16': 'ar16',
  'major_17': 'ar17',
  'major_18': 'ar18',
  'major_19': 'ar19',
  'major_20': 'ar20',
  'major_21': 'ar21',
  
  // Cups
  'cups_ace': 'cuac',
  'cups_2': 'cu02',
  'cups_3': 'cu03',
  'cups_4': 'cu04',
  'cups_5': 'cu05',
  'cups_6': 'cu06',
  'cups_7': 'cu07',
  'cups_8': 'cu08',
  'cups_9': 'cu09',
  'cups_10': 'cu10',
  'cups_page': 'cupa',
  'cups_knight': 'cukn',
  'cups_queen': 'cuqu',
  'cups_king': 'cuki',
  
  // Wands
  'wands_ace': 'waac',
  'wands_2': 'wa02',
  'wands_3': 'wa03',
  'wands_4': 'wa04',
  'wands_5': 'wa05',
  'wands_6': 'wa06',
  'wands_7': 'wa07',
  'wands_8': 'wa08',
  'wands_9': 'wa09',
  'wands_10': 'wa10',
  'wands_page': 'wapa',
  'wands_knight': 'wakn',
  'wands_queen': 'waqu',
  'wands_king': 'waki',
  
  // Swords
  'swords_ace': 'swac',
  'swords_2': 'sw02',
  'swords_3': 'sw03',
  'swords_4': 'sw04',
  'swords_5': 'sw05',
  'swords_6': 'sw06',
  'swords_7': 'sw07',
  'swords_8': 'sw08',
  'swords_9': 'sw09',
  'swords_10': 'sw10',
  'swords_page': 'swpa',
  'swords_knight': 'swkn',
  'swords_queen': 'swqu',
  'swords_king': 'swki',
  
  // Pentacles
  'pentacles_ace': 'peac',
  'pentacles_2': 'pe02',
  'pentacles_3': 'pe03',
  'pentacles_4': 'pe04',
  'pentacles_5': 'pe05',
  'pentacles_6': 'pe06',
  'pentacles_7': 'pe07',
  'pentacles_8': 'pe08',
  'pentacles_9': 'pe09',
  'pentacles_10': 'pe10',
  'pentacles_page': 'pepa',
  'pentacles_knight': 'pekn',
  'pentacles_queen': 'pequ',
  'pentacles_king': 'peki',
};

// 3 рабочих источника (fallback если один не работает)
const IMAGE_SOURCES = [
  {
    name: 'Sacred Texts',
    baseUrl: 'https://sacred-texts.com/tarot/pkt/img',
    getUrl: (filename) => `https://sacred-texts.com/tarot/pkt/img/${filename}.jpg`
  },
  {
    name: 'Wikimedia Commons',
    baseUrl: 'https://upload.wikimedia.org/wikipedia/commons',
    getUrl: (cardId) => {
      // Специальный маппинг для Wikimedia
      const wikiMap = {
        'major_0': 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg',
        'major_1': 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
        'major_2': 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
        'major_3': 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg',
        'major_4': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg',
        'major_5': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg',
        'major_6': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg',
        'major_7': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
        'major_8': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
        'major_9': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg',
        'major_10': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg',
        'major_11': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg',
        'major_12': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg',
        'major_13': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg',
        'major_14': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg',
        'major_15': 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg',
        'major_16': 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
        'major_17': 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg',
        'major_18': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg',
        'major_19': 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg',
        'major_20': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg',
        'major_21': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg',
        // Cups
        'cups_ace': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Cups01.jpg',
        'cups_2': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Cups02.jpg',
        'cups_3': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Cups03.jpg',
        'cups_4': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Cups04.jpg',
        'cups_5': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Cups05.jpg',
        'cups_6': 'https://upload.wikimedia.org/wikipedia/commons/1/17/Cups06.jpg',
        'cups_7': 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Cups07.jpg',
        'cups_8': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Cups08.jpg',
        'cups_9': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Cups09.jpg',
        'cups_10': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Cups10.jpg',
        'cups_page': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Cups11.jpg',
        'cups_knight': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Cups12.jpg',
        'cups_queen': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Cups13.jpg',
        'cups_king': 'https://upload.wikimedia.org/wikipedia/commons/0/03/Cups14.jpg',
        // Wands
        'wands_ace': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Wands01.jpg',
        'wands_2': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Wands02.jpg',
        'wands_3': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands03.jpg',
        'wands_4': 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Wands04.jpg',
        'wands_5': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Wands05.jpg',
        'wands_6': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Wands06.jpg',
        'wands_7': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Wands07.jpg',
        'wands_8': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Wands08.jpg',
        'wands_9': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Tarot_Nine_of_Wands.jpg',
        'wands_10': 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands10.jpg',
        'wands_page': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Wands11.jpg',
        'wands_knight': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Wands12.jpg',
        'wands_queen': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Wands13.jpg',
        'wands_king': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Wands14.jpg',
        // Swords
        'swords_ace': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg',
        'swords_2': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Swords02.jpg',
        'swords_3': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Swords03.jpg',
        'swords_4': 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Swords04.jpg',
        'swords_5': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Swords05.jpg',
        'swords_6': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Swords06.jpg',
        'swords_7': 'https://upload.wikimedia.org/wikipedia/commons/3/34/Swords07.jpg',
        'swords_8': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Swords08.jpg',
        'swords_9': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Swords09.jpg',
        'swords_10': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords10.jpg',
        'swords_page': 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Swords11.jpg',
        'swords_knight': 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Swords12.jpg',
        'swords_queen': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords13.jpg',
        'swords_king': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Swords14.jpg',
        // Pentacles
        'pentacles_ace': 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Pents01.jpg',
        'pentacles_2': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Pents02.jpg',
        'pentacles_3': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Pents03.jpg',
        'pentacles_4': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Pents04.jpg',
        'pentacles_5': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Pents05.jpg',
        'pentacles_6': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Pents06.jpg',
        'pentacles_7': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents07.jpg',
        'pentacles_8': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Pents08.jpg',
        'pentacles_9': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Pents09.jpg',
        'pentacles_10': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Pents10.jpg',
        'pentacles_page': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Pents11.jpg',
        'pentacles_knight': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Pents12.jpg',
        'pentacles_queen': 'https://upload.wikimedia.org/wikipedia/commons/8/88/Pents13.jpg',
        'pentacles_king': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Pents14.jpg',
      };
      return wikiMap[cardId] || null;
    }
  },
  {
    name: 'GitHub CDN',
    baseUrl: 'https://cdn.jsdelivr.net/gh/dariusk/tarot-cards@master/card-images',
    getUrl: (filename) => `https://cdn.jsdelivr.net/gh/dariusk/tarot-cards@master/card-images/${filename}.jpg`
  }
];

/**
 * Получить URL изображения карты с fallback
 */
export function getCardImageUrl(cardId) {
  // Сначала пробуем Wikimedia (самый надежный)
  const wikiUrl = IMAGE_SOURCES[1].getUrl(cardId);
  if (wikiUrl) {
    return wikiUrl;
  }

  // Если нет в Wikimedia - пробуем Sacred Texts
  const filename = cardApiNames[cardId];
  if (filename) {
    return IMAGE_SOURCES[0].getUrl(filename);
  }

  console.warn(`No image found for card: ${cardId}`);
  return null;
}

/**
 * Альтернативный источник (если основной не работает)
 */
export function getCardImageUrlAlt(cardId) {
  const filename = cardApiNames[cardId];
  if (!filename) return null;
  
  return IMAGE_SOURCES[2].getUrl(filename);
}

export default getCardImageUrl;