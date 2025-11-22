import { supabase } from '../config/database.js';
import logger from '../utils/logger.js';

class DatabaseService {
  // ============ ПОЛЬЗОВАТЕЛИ ============
  
  async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting user:', error);
      return null;
    }
  }

  async createUser(userId, userData = {}) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          language_code: userData.language_code || 'ru',
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`User created: ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error creating user:', error);
      return null;
    }
  }

  async getOrCreateUser(userId, userData = {}) {
    let user = await this.getUser(userId);
    if (!user) {
      user = await this.createUser(userId, userData);
    }
    return user;
  }

  async updateUser(userId, updates) {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error updating user:', error);
      return false;
    }
  }

  async incrementUserSpreads(userId) {
    try {
      const user = await this.getUser(userId);
      await this.updateUser(userId, {
        total_spreads: (user.total_spreads || 0) + 1
      });
    } catch (error) {
      logger.error('Error incrementing spreads:', error);
    }
  }

  async isUserPremium(userId) {
    try {
      const user = await this.getUser(userId);
      if (!user || !user.is_premium) return false;
      if (!user.premium_until) return false;

      return new Date(user.premium_until) > new Date();
    } catch (error) {
      logger.error('Error checking premium:', error);
      return false;
    }
  }

  async grantPremium(userId, months = 1) {
    try {
      const premiumUntil = new Date();
      premiumUntil.setMonth(premiumUntil.getMonth() + months);

      await this.updateUser(userId, {
        is_premium: true,
        premium_until: premiumUntil.toISOString(),
      });

      await this.logEvent(userId, 'premium_granted', { months, until: premiumUntil });
      
      logger.info(`Premium granted to user ${userId} until ${premiumUntil}`);
      return true;
    } catch (error) {
      logger.error('Error granting premium:', error);
      return false;
    }
  }

  // ============ РАСКЛАДЫ ============

  async saveSpread(userId, spreadType, spreadName, cards, interpretation) {
    try {
      const { data, error } = await supabase
        .from('user_spreads')
        .insert({
          user_id: userId,
          spread_type: spreadType,
          spread_name: spreadName,
          cards: cards,
          interpretation: interpretation,
        })
        .select()
        .single();

      if (error) throw error;

      await this.incrementUserSpreads(userId);
      await this.logEvent(userId, 'spread_completed', { 
        spread_type: spreadType,
        cards_count: cards.length 
      });

      logger.info(`Spread saved for user ${userId}: ${spreadType}`);
      return data;
    } catch (error) {
      logger.error('Error saving spread:', error);
      return null;
    }
  }

  async getUserSpreads(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('user_spreads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error getting user spreads:', error);
      return [];
    }
  }

  async getSpreadById(spreadId) {
    try {
      const { data, error } = await supabase
        .from('user_spreads')
        .select('*')
        .eq('id', spreadId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error getting spread:', error);
      return null;
    }
  }

  async deleteSpread(userId, spreadId) {
    try {
      const { error } = await supabase
        .from('user_spreads')
        .delete()
        .eq('id', spreadId)
        .eq('user_id', userId); // Безопасность: только свои расклады

      if (error) throw error;
      
      await this.logEvent(userId, 'spread_deleted', { spread_id: spreadId });
      logger.info(`Spread deleted: ${spreadId} by user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting spread:', error);
      return false;
    }
  }

  // ============ ТРАНЗАКЦИИ ============

  async createTransaction(userId, amount, currency, metadata = {}) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount,
          currency,
          status: 'pending',
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      logger.info(`Transaction created: ${data.id} for user ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      return null;
    }
  }

  async updateTransaction(transactionId, updates) {
    try {
      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error updating transaction:', error);
      return false;
    }
  }

  async completeTransaction(transactionId, paymentId) {
    return await this.updateTransaction(transactionId, {
      status: 'completed',
      payment_id: paymentId,
    });
  }

  // ============ СТАТИСТИКА ============

  async logEvent(userId, eventType, metadata = {}) {
    try {
      await supabase
        .from('statistics')
        .insert({
          user_id: userId,
          event_type: eventType,
          metadata,
        });
    } catch (error) {
      logger.error('Error logging event:', error);
    }
  }

  async getUserStats(userId) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('total_spreads')
        .eq('id', userId)
        .single();

      const { data: spreads } = await supabase
        .from('user_spreads')
        .select('cards')
        .eq('user_id', userId);

      const cardFrequency = {};
      spreads?.forEach(spread => {
        spread.cards.forEach(card => {
          cardFrequency[card.name] = (cardFrequency[card.name] || 0) + 1;
        });
      });

      const mostFrequent = Object.entries(cardFrequency)
        .sort((a, b) => b[1] - a[1])[0];

      return {
        totalSpreads: user?.total_spreads || 0,
        mostFrequentCard: mostFrequent ? mostFrequent[0] : null,
        mostFrequentCount: mostFrequent ? mostFrequent[1] : 0,
      };
    } catch (error) {
      logger.error('Error getting user stats:', error);
      return null;
    }
  }

  async getGlobalStats() {
    try {
      // Всего пользователей
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Премиум пользователей
      const { count: premiumUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true)
        .gte('premium_until', new Date().toISOString());

      // Всего раскладов
      const { count: totalSpreads } = await supabase
        .from('user_spreads')
        .select('*', { count: 'exact', head: true });

      // Новые пользователи сегодня
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayNewUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Расклады сегодня
      const { count: todaySpreads } = await supabase
        .from('user_spreads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Популярный расклад
      const { data: popularSpread } = await supabase
        .from('user_spreads')
        .select('spread_name')
        .limit(1000);

      const spreadCounts = {};
      popularSpread?.forEach(s => {
        spreadCounts[s.spread_name] = (spreadCounts[s.spread_name] || 0) + 1;
      });

      const mostPopular = Object.entries(spreadCounts)
        .sort((a, b) => b[1] - a[1])[0];

      return {
        totalUsers: totalUsers || 0,
        premiumUsers: premiumUsers || 0,
        totalSpreads: totalSpreads || 0,
        averageSpreadsPerUser: totalUsers > 0 ? (totalSpreads / totalUsers).toFixed(1) : 0,
        mostPopularSpread: mostPopular ? mostPopular[0] : null,
        todayNewUsers: todayNewUsers || 0,
        todaySpreads: todaySpreads || 0,
      };
    } catch (error) {
      logger.error('Error getting global stats:', error);
      return {
        totalUsers: 0,
        premiumUsers: 0,
        totalSpreads: 0,
        averageSpreadsPerUser: 0,
        mostPopularSpread: null,
        todayNewUsers: 0,
        todaySpreads: 0,
      };
    }
  }

  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error getting all users:', error);
      return [];
    }
  }
}

export const db = new DatabaseService();