// Альтернативный источник - Sacred Texts (более надежный)
const TAROT_IMAGES_BASE = 'https://www.sacred-texts.com/tarot/pkt/img';

const cardImageMap = {
  // Major Arcana
  'major_0': 'ar00.jpg',
  'major_1': 'ar01.jpg',
  'major_2': 'ar02.jpg',
  'major_3': 'ar03.jpg',
  'major_4': 'ar04.jpg',
  'major_5': 'ar05.jpg',
  'major_6': 'ar06.jpg',
  'major_7': 'ar07.jpg',
  'major_8': 'ar08.jpg',
  'major_9': 'ar09.jpg',
  'major_10': 'ar10.jpg',
  'major_11': 'ar11.jpg',
  'major_12': 'ar12.jpg',
  'major_13': 'ar13.jpg',
  'major_14': 'ar14.jpg',
  'major_15': 'ar15.jpg',
  'major_16': 'ar16.jpg',
  'major_17': 'ar17.jpg',
  'major_18': 'ar18.jpg',
  'major_19': 'ar19.jpg',
  'major_20': 'ar20.jpg',
  'major_21': 'ar21.jpg',
  
  // Cups
  'cups_ace': 'cuac.jpg',
  'cups_2': 'cu02.jpg',
  'cups_3': 'cu03.jpg',
  'cups_4': 'cu04.jpg',
  'cups_5': 'cu05.jpg',
  'cups_6': 'cu06.jpg',
  'cups_7': 'cu07.jpg',
  'cups_8': 'cu08.jpg',
  'cups_9': 'cu09.jpg',
  'cups_10': 'cu10.jpg',
  'cups_page': 'cupa.jpg',
  'cups_knight': 'cukn.jpg',
  'cups_queen': 'cuqu.jpg',
  'cups_king': 'cuki.jpg',
  
  // Wands
  'wands_ace': 'waac.jpg',
  'wands_2': 'wa02.jpg',
  'wands_3': 'wa03.jpg',
  'wands_4': 'wa04.jpg',
  'wands_5': 'wa05.jpg',
  'wands_6': 'wa06.jpg',
  'wands_7': 'wa07.jpg',
  'wands_8': 'wa08.jpg',
  'wands_9': 'wa09.jpg',
  'wands_10': 'wa10.jpg',
  'wands_page': 'wapa.jpg',
  'wands_knight': 'wakn.jpg',
  'wands_queen': 'waqu.jpg',
  'wands_king': 'waki.jpg',
  
  // Swords
  'swords_ace': 'swac.jpg',
  'swords_2': 'sw02.jpg',
  'swords_3': 'sw03.jpg',
  'swords_4': 'sw04.jpg',
  'swords_5': 'sw05.jpg',
  'swords_6': 'sw06.jpg',
  'swords_7': 'sw07.jpg',
  'swords_8': 'sw08.jpg',
  'swords_9': 'sw09.jpg',
  'swords_10': 'sw10.jpg',
  'swords_page': 'swpa.jpg',
  'swords_knight': 'swkn.jpg',
  'swords_queen': 'swqu.jpg',
  'swords_king': 'swki.jpg',
  
  // Pentacles
  'pentacles_ace': 'peac.jpg',
  'pentacles_2': 'pe02.jpg',
  'pentacles_3': 'pe03.jpg',
  'pentacles_4': 'pe04.jpg',
  'pentacles_5': 'pe05.jpg',
  'pentacles_6': 'pe06.jpg',
  'pentacles_7': 'pe07.jpg',
  'pentacles_8': 'pe08.jpg',
  'pentacles_9': 'pe09.jpg',
  'pentacles_10': 'pe10.jpg',
  'pentacles_page': 'pepa.jpg',
  'pentacles_knight': 'pekn.jpg',
  'pentacles_queen': 'pequ.jpg',
  'pentacles_king': 'peki.jpg',
};

export function getCardImageUrl(cardId) {
  const filename = cardImageMap[cardId];
  if (!filename) {
    console.warn(`No image found for card: ${cardId}`);
    return null;
  }
  return `${TAROT_IMAGES_BASE}/${filename}`;
}

export default getCardImageUrl;