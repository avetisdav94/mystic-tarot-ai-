export function getMainKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔮 Новый расклад', callback_data: 'new_spread' }
        ],
        [
          { text: '🌅 Карта дня', callback_data: 'daily_card' }
        ],
        [
          { text: '📖 Справочник карт', callback_data: 'reference' }
        ],
        [
          { text: '📚 Мои расклады', callback_data: 'history' },
          { text: '📊 Статистика', callback_data: 'stats' }
        ],
        [
          { text: '💎 Премиум', callback_data: 'premium' },
          { text: 'ℹ️ Помощь', callback_data: 'help' }
        ]
      ]
    }
  };
}

export function getBackToMainButton() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
      ]
    }
  };
}