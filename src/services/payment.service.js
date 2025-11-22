import { db } from './database.service.js';
import logger from '../utils/logger.js';

class PaymentService {
  async createPaymentForSpread(userId, spread) {
    try {
      const transaction = await db.createTransaction(
        userId,
        spread.price,
        spread.currency || 'PLN',
        {
          spread_id: spread.id,
          spread_name: spread.name,
          type: 'spread_purchase'
        }
      );

      return transaction;
    } catch (error) {
      logger.error('Error creating payment:', error);
      return null;
    }
  }

  async createSubscriptionPayment(userId, months = 1) {
    try {
      const price = months === 1 ? 15 : months * 12; // Скидка на год
      
      const transaction = await db.createTransaction(
        userId,
        price,
        'PLN',
        {
          type: 'subscription',
          months,
        }
      );

      return transaction;
    } catch (error) {
      logger.error('Error creating subscription payment:', error);
      return null;
    }
  }

  async handleSuccessfulPayment(userId, transactionId, paymentId) {
    try {
      const success = await db.completeTransaction(transactionId, paymentId);
      
      if (success) {
        await db.logEvent(userId, 'payment_success', {
          transaction_id: transactionId,
          payment_id: paymentId,
        });
        
        logger.info(`Payment successful for user ${userId}, transaction ${transactionId}`);
      }

      return success;
    } catch (error) {
      logger.error('Error handling successful payment:', error);
      return false;
    }
  }

  // Для будущей интеграции со Stripe
  async createStripePaymentIntent(amount, currency, metadata) {
    // TODO: Интеграция со Stripe
    logger.info('Stripe integration coming soon...');
    return null;
  }
}

export const paymentService = new PaymentService();