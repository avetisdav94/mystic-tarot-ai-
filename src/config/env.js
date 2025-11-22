// В Railway dotenv НЕ нужен - переменные уже в process.env
console.log('🔍 Loading environment variables...');

// Проверка обязательных переменных
const required = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
};

// Дебаг
for (const [key, value] of Object.entries(required)) {
  console.log(`${key}:`, value ? '✅ Found' : '❌ Missing');
}

// Проверяем что все есть
const missing = Object.entries(required)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('\n📋 All environment variables:');
  console.error(Object.keys(process.env).sort().join('\n'));
  process.exit(1);
}

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

console.log('✅ Config loaded successfully');
console.log('Environment:', process.env.NODE_ENV || 'development');