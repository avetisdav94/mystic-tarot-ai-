import { createBot } from './bot.js';
import { config } from './config/env.js';
import logger from './utils/logger.js';

async function main() {
  try {
    logger.info('🚀 Starting Tarot Bot...');
    logger.info(`Environment: ${config.isDevelopment ? 'development' : 'production'}`);

    const bot = createBot();

    logger.info('✅ Bot started successfully!');
    logger.info('Waiting for messages...');

    // Graceful shutdown
    process.on('SIGINT', () => {
      logger.info('🛑 Shutting down bot...');
      bot.stopPolling();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('🛑 Shutting down bot...');
      bot.stopPolling();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

main();