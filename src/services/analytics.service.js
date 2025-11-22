import { db } from './database.service.js';

export async function getProjectStats() {
  const stats = await db.getGlobalStats();
  
  return {
    totalUsers: stats.totalUsers,
    totalSpreads: stats.totalSpreads,
    premiumUsers: stats.premiumUsers,
    mostPopularSpread: stats.mostPopularSpread,
    averageSpreadsPerUser: stats.averageSpreadsPerUser,
  };
}