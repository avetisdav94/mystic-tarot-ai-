import dotenv from 'dotenv';

dotenv.config();

// Выводим для проверки (удали потом!)
console.log('🔍 Проверка переменных окружения:');
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Найден' : '❌ НЕ найден');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Найден' : '❌ НЕ найден');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Найден' : '❌ НЕ найден');

export const config = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
  },
  adminIds: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(id => parseInt(id)) : [],
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};

// Простая проверка обязательных переменных
if (!config.telegram.token) {
  console.error('❌ TELEGRAM_BOT_TOKEN не найден в .env файле!');
  console.error('📁 Проверь, что файл .env находится в корне проекта');
  console.error('📝 Формат: TELEGRAM_BOT_TOKEN=твой_токен');
  process.exit(1);
}

console.log('✅ Конфигурация загружена успешно!');