export function getPaymentKeyboard(transactionId, amount, currency) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: `💳 Оплатить ${amount} ${currency}`, 
            callback_data: `pay:${transactionId}` 
          }
        ],
        [
          { text: '◀️ Назад', callback_data: 'premium' }
        ]
      ]
    }
  };
}

export function getSubscriptionKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📅 1 месяц - 15 PLN', callback_data: 'subscribe:1' }
        ],
        [
          { text: '📅 3 месяца - 40 PLN', callback_data: 'subscribe:3' }
        ],
        [
          { text: '📅 12 месяцев - 144 PLN', callback_data: 'subscribe:12' }
        ],
        [
          { text: '◀️ Назад', callback_data: 'premium' }
        ]
      ]
    }
  };
}