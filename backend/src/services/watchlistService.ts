import { watchlistRepository } from '../repositories/watchlistRepository';

export const watchlistService = {
  getWatchlist: async (userId: string) => {
    return watchlistRepository.findAllByUserId(userId);
  },

  addStockToWatchlist: async (userId: string, symbol: string) => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    const existing = await watchlistRepository.findByUserIdAndSymbol(
      userId,
      normalizedSymbol
    );

    if (existing) {
      throw new Error('Stock already exists in watchlist');
    }

    return watchlistRepository.create(userId, normalizedSymbol);
  },

  removeStockFromWatchlist: async (userId: string, symbol: string) => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    const existing = await watchlistRepository.findByUserIdAndSymbol(
      userId,
      normalizedSymbol
    );

    if (!existing) {
      throw new Error('Stock not found in watchlist');
    }

    await watchlistRepository.deleteByUserIdAndSymbol(userId, normalizedSymbol);
  },
};