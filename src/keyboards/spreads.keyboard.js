import { SPREADS, getFreeSpread, getPremiumSpreads } from '../constants/spreads.js';

export function getSpreadsKeyboard() {
  const keyboard = [];

  // Бесплатные расклады
  keyboard.push([{ text: '🆓 БЕСПЛАТНЫЕ РАСКЛАДЫ', callback_data: 'ignore' }]);
  
  getFreeSpread().forEach(spread => {
    keyboard.push([{
      text: `${spread.emoji} ${spread.name} (${spread.cardsCount} карт)`,
      callback_data: `select_spread:${spread.id}`
    }]);
  });

  // Премиум расклады
  keyboard.push([{ text: '💎 ПРЕМИУМ РАСКЛАДЫ', callback_data: 'ignore' }]);
  
  getPremiumSpreads().forEach(spread => {
    keyboard.push([{
      text: `${spread.emoji} ${spread.name} - ${spread.price} ${spread.currency}`,
      callback_data: `select_spread:${spread.id}`
    }]);
  });

  keyboard.push([{ text: '◀️ Назад', callback_data: 'main_menu' }]);

  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

export function getSpreadConfirmKeyboard(spreadId) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Начать', callback_data: `start_spread:${spreadId}` },
          { text: '◀️ Назад', callback_data: 'new_spread' }
        ]
      ]
    }
  };
}