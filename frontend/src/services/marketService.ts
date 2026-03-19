import apiClient from './apiClient';
import type {
  StockDetailsResponse,
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

  getStockDetails: async (symbol: string): Promise<StockDetailsResponse> => {
    const response = await apiClient.get(`/api/market/stocks/${symbol}`);
    return response.data;
  },
};