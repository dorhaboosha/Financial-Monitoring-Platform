import axios from 'axios';
import { env } from '../config/env';
import {
  FinnhubCompanyProfileResponse,
  FinnhubQuoteResponse,
  FinnhubStockSymbolItem,
  FinnhubSymbolSearchResponse,
} from '../types/finnhub';

const finnhubClient = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  timeout: 10000,
});

const getAuthParams = () => ({
  token: env.finnhubApiKey,
});

export const finnhubService = {
  getQuote: async (symbol: string): Promise<FinnhubQuoteResponse> => {
    const response = await finnhubClient.get('/quote', {
      params: {
        symbol,
        ...getAuthParams(),
      },
    });

    return response.data;
  },

  searchSymbols: async (query: string): Promise<FinnhubSymbolSearchResponse> => {
    const response = await finnhubClient.get('/search', {
      params: {
        q: query,
        ...getAuthParams(),
      },
    });

    return response.data;
  },

  getCompanyProfile: async (symbol: string): Promise<FinnhubCompanyProfileResponse> => {
    const response = await finnhubClient.get('/stock/profile2', {
      params: {
        symbol,
        ...getAuthParams(),
      },
    });

    return response.data;
  },

  getStockSymbolsByExchange: async (exchange: string): Promise<FinnhubStockSymbolItem[]> => {
    const response = await finnhubClient.get('/stock/symbol', {
      params: {
        exchange,
        ...getAuthParams(),
      },
    });

    return response.data;
  },
};