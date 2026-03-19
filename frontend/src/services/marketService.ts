import apiClient from './apiClient';
import type { TickerStocksResponse } from '../types/market';

export const marketService = {
  getTickerStocks: async (): Promise<TickerStocksResponse> => {
    const response = await apiClient.get('/api/market/ticker');
    return response.data;
  },
};