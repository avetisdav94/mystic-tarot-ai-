import Groq from 'groq-sdk';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

const groq = new Groq({ apiKey: config.groq.apiKey });

// Актуальные модели Groq (на ноябрь 2025)
const AVAILABLE_MODELS = {
  LLAMA_70B: 'llama-3.3-70b-versatile',      // Новая! Самая мощная
  LLAMA_8B: 'llama-3.1-8b-instant',          // Быстрая
  MIXTRAL: 'mixtral-8x7b-32768',             // Хороший контекст
  GEMMA: 'gemma2-9b-it',                     // Альтернатива
};

// Используем самую новую модель
const CURRENT_MODEL = AVAILABLE_MODELS.LLAMA_70B;

class AIService {
  async interpretCard(card, spread, positionInfo) {
    const prompt = this.buildCardPrompt(card, spread, positionInfo);

    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Ты опытный таролог с 20-летним стажем. Твои толкования глубокие, точные и помогают людям найти ответы. Ты говоришь на русском языке.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: CURRENT_MODEL,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'Не удалось получить толкование';
    } catch (error) {
      logger.error('Groq API error:', error);
      
      // Если модель не работает, пробуем запасную
      if (error.status === 400 && error.error?.error?.code === 'model_decommissioned') {
        logger.warn(`Модель ${CURRENT_MODEL} не работает, пробую запасную...`);
        return await this.interpretCardWithFallback(card, spread, positionInfo);
      }
      
      throw new Error('Ошибка при получении толкования от AI');
    }
  }

  async interpretSpread(cards, spread) {
    const prompt = this.buildSpreadPrompt(cards, spread);

    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Ты мастер Таро с глубоким пониманием символизма и взаимосвязей между картами. Дай целостное толкование расклада, показывающее общую картину.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: CURRENT_MODEL,
        temperature: 0.8,
        max_tokens: 2500,
      });

      return response.choices[0]?.message?.content || 'Не удалось получить толкование';
    } catch (error) {
      logger.error('Groq API error:', error);
      
      // Если модель не работает, пробуем запасную
      if (error.status === 400) {
        logger.warn(`Модель ${CURRENT_MODEL} не работает, пробую запасную...`);
        return await this.interpretSpreadWithFallback(cards, spread);
      }
      
      throw new Error('Ошибка при получении толкования от AI');
    }
  }

  // Запасной вариант с более быстрой моделью
  async interpretCardWithFallback(card, spread, positionInfo) {
    try {
      const prompt = this.buildCardPrompt(card, spread, positionInfo);
      
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Ты опытный таролог. Дай точное толкование карты на русском языке.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: AVAILABLE_MODELS.LLAMA_8B, // Запасная модель
        temperature: 0.7,
        max_tokens: 800,
      });

      return response.choices[0]?.message?.content || 'Не удалось получить толкование';
    } catch (error) {
      logger.error('Fallback API error:', error);
      // Если и это не работает, возвращаем базовое толкование
      return this.getBasicInterpretation(card, spread, positionInfo);
    }
  }

  async interpretSpreadWithFallback(cards, spread) {
    try {
      const prompt = this.buildSpreadPrompt(cards, spread);
      
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Ты мастер Таро. Дай толкование расклада на русском языке.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: AVAILABLE_MODELS.LLAMA_8B, // Запасная модель
        temperature: 0.8,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || 'Не удалось получить толкование';
    } catch (error) {
      logger.error('Fallback API error:', error);
      // Если и это не работает, возвращаем базовое толкование
      return this.getBasicSpreadInterpretation(cards, spread);
    }
  }

  // Базовое толкование если AI не работает
  getBasicInterpretation(card, spread, positionInfo) {
    let text = `🃏 **${card.name}**\n\n`;
    text += `**Ключевые слова:** ${card.keywords.join(', ')}\n\n`;
    
    if (positionInfo) {
      text += `**Позиция "${positionInfo.name}":**\n`;
      text += `${positionInfo.description}\n\n`;
    }
    
    text += `**Значение:**\n`;
    text += `Эта карта указывает на ${card.keywords[0]} и ${card.keywords[1]}. `;
    text += `Сейчас важно обратить внимание на эти аспекты в вашей жизни.\n\n`;
    text += `💡 *Совет:* Доверьтесь своей интуиции при работе с этой картой.`;
    
    return text;
  }

  getBasicSpreadInterpretation(cards, spread) {
    let text = `🔮 **${spread.name}**\n\n`;
    
    cards.forEach((card, index) => {
      const position = spread.positions[index];
      text += `**${position.number}. ${position.name}:** ${card.emoji} ${card.name}\n`;
      text += `Ключевые слова: ${card.keywords.slice(0, 3).join(', ')}\n\n`;
    });
    
    text += `**Общее толкование:**\n`;
    text += `Этот расклад показывает важные энергии в вашей ситуации. `;
    text += `Обратите внимание на взаимосвязь между картами и их позициями. `;
    text += `Используйте свою интуицию для более глубокого понимания.\n\n`;
    text += `💡 *Совет:* Медитируйте на эти карты для получения дополнительных инсайтов.`;
    
    return text;
  }

  buildCardPrompt(card, spread, positionInfo) {
    return `
Дай толкование карты Таро:

🃏 Карта: ${card.name}
📋 Расклад: ${spread.name}
${positionInfo ? `📍 Позиция: ${positionInfo.name} - ${positionInfo.description}` : ''}

Ключевые слова карты: ${card.keywords.join(', ')}

Структурируй ответ следующим образом:

**✨ Общее значение**
Расскажи о символизме и энергии этой карты

**🎯 В контексте позиции "${positionInfo?.name || 'Карта дня'}"**
Как эта карта отвечает на вопрос данной позиции

**💡 Совет**
Практический совет на основе этой карты

**🔑 Ключевое послание**
Главная мысль одним предложением

Отвечай дружелюбно и воодушевляюще, но профессионально. Максимум 400 слов.
    `.trim();
  }

  buildSpreadPrompt(cards, spread) {
    const cardsInfo = cards.map((card, index) => {
      const position = spread.positions[index];
      return `${position.number}. ${position.name}: ${card.name} ${card.emoji}`;
    }).join('\n');

    return `
Дай целостное толкование расклада Таро:

📋 Расклад: ${spread.name}
${spread.description}

🃏 Выпавшие карты:
${cardsInfo}

Проанализируй расклад и дай толкование:

**🌟 Общая картина**
Какую историю рассказывают эти карты вместе? В чём главное послание расклада?

**🔍 Детальный анализ по позициям**
Значение каждой карты в её позиции и как они взаимодействуют друг с другом

**⚠️ На что обратить внимание**
Ключевые моменты и важные детали

**💪 Рекомендации**
Конкретные практические советы и действия

**✨ Итоговое послание**
Обобщающая мысль - что важно понять и запомнить из этого расклада

Создай глубокое, вдохновляющее толкование, показывающее связи между картами и давая человеку ясность. Максимум 1000 слов.
    `.trim();
  }

  // Метод для проверки доступных моделей
  async testAvailableModels() {
    const testPrompt = 'Скажи привет';
    
    for (const [name, model] of Object.entries(AVAILABLE_MODELS)) {
      try {
        const response = await groq.chat.completions.create({
          messages: [{ role: 'user', content: testPrompt }],
          model: model,
          max_tokens: 50,
        });
        
        if (response.choices[0]?.message?.content) {
          logger.info(`✅ Модель ${name} (${model}) работает`);
        }
      } catch (error) {
        logger.error(`❌ Модель ${name} (${model}) не работает:`, error.message);
      }
    }
  }
}

export const aiService = new AIService();

// Экспортируем для тестирования
export { AVAILABLE_MODELS, CURRENT_MODEL };