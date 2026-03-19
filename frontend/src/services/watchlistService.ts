import apiClient from './apiClient';
import type {
    AddWatchlistStockRequest,
    AddWatchlistStockResponse,
    RemoveWatchlistStockResponse,
    WatchlistResponse,
} from '../types/watchlist';

export const watchlistService = {
  getWatchlist: async (): Promise<WatchlistResponse> => {
    const response = await apiClient.get('/api/watchlist');
    return response.data;
  },

  addStockToWatchlist: async (
    payload: AddWatchlistStockRequest
  ): Promise<AddWatchlistStockResponse> => {
    const response = await apiClient.post('/api/watchlist', payload);
    return response.data;
  },

  removeStockFromWatchlist: async (
    symbol: string
  ): Promise<RemoveWatchlistStockResponse> => {
    const response = await apiClient.delete(`/api/watchlist/${symbol}`);
    return response.data;
  },
};