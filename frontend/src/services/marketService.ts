import apiClient from './apiClient';
import type {
  StockSearchResponse,
  TickerStocksResponse,
} from '../types/market';

export const marketService = {
  getTickerStocks: async (): Promise<TickerStocksResponse> => {
    const response = await apiClient.get('/api/market/ticker');
    return response.data;
  },

  getSearchSuggestions: async (): Promise<StockSearchResponse> => {
    const response = await apiClient.get('/api/market/search-suggestions');
    return response.data;
  },

  searchStocks: async (query: string): Promise<StockSearchResponse> => {
    const response = await apiClient.get('/api/market/search', {
      params: { q: query },
    });

    return response.data;
  },
};