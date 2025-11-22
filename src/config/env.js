import dotenv from 'dotenv';

// Загружаем .env только в development (в Railway его нет)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Проверяем переменные
const requiredVars = ['TELEGRAM_BOT_TOKEN'];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    console.error('Available variables:', Object.keys(process.env).filter(k => k.includes('TELEGRAM') || k.includes('SUPABASE') || k.includes('GROQ')));
    process.exit(1);
  }
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