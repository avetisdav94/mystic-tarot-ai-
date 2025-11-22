import { SPREADS, getFreeSpread, getPremiumSpreads } from '../constants/spreads.js';

export function getSpreadsKeyboard() {
  const keyboard = [];

  // Заголовок бесплатных
  keyboard.push([{ text: '━━━━ 🆓 БЕСПЛАТНЫЕ ━━━━', callback_data: 'ignore' }]);
  
  getFreeSpread().forEach(spread => {
    keyboard.push([{
      text: `${spread.emoji} ${spread.name}`,
      callback_data: `select_spread:${spread.id}`
    }]);
  });

  // Заголовок премиум
  keyboard.push([{ text: '━━━━ 💎 ПРЕМИУМ ━━━━', callback_data: 'ignore' }]);
  
  getPremiumSpreads().forEach(spread => {
    keyboard.push([{
      text: `${spread.emoji} ${spread.name} — ${spread.price} ${spread.currency}`,
      callback_data: `select_spread:${spread.id}`
    }]);
  });

  keyboard.push([{ text: '◀️ Главное меню', callback_data: 'main_menu' }]);

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
          { text: '✅ Начать расклад', callback_data: `start_spread:${spreadId}` }
        ],
        [
          { text: '◀️ Выбрать другой', callback_data: 'new_spread' }
        ],
        [
          { text: '🏠 Главное меню', callback_data: 'main_menu' }
        ]
      ]
    }
  };
}