import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const models = [
  'llama-3.3-70b-versatile',
  'llama-3.3-70b-specdec',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
  'gemma-7b-it',
];

async function testModels() {
  console.log('🧪 Тестирую доступные модели Groq...\n');

  for (const model of models) {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: 'Скажи одно слово: привет'
          }
        ],
        model: model,
        max_tokens: 10,
      });

      if (response.choices[0]?.message?.content) {
        console.log(`✅ ${model} - РАБОТАЕТ`);
        console.log(`   Ответ: ${response.choices[0].message.content}\n`);
      }
    } catch (error) {
      console.log(`❌ ${model} - НЕ РАБОТАЕТ`);
      console.log(`   Ошибка: ${error.message}\n`);
    }
  }
}

testModels();