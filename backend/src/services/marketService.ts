import { finnhubService } from './finnhubService';
import { tickerCacheService } from './tickerCacheService';
import {
  StockDetailsResponse,
  StockSearchItem,
  TickerStockItem,
} from '../types/market';

export const marketService = {
  getTickerStocks: async (): Promise<TickerStockItem[]> => {
    return tickerCacheService.getTickerBatch();
  },

  searchStocks: async (query: string): Promise<StockSearchItem[]> => {
    const response = await finnhubService.searchSymbols(query);

    return response.result.map((item) => ({
      symbol: item.symbol,
      displaySymbol: item.displaySymbol,
      description: item.description,
      type: item.type,
    }));
  },

  getStockDetails: async (symbol: string): Promise<StockDetailsResponse> => {
    const [quote, profile] = await Promise.all([
      finnhubService.getQuote(symbol),
      finnhubService.getCompanyProfile(symbol),
    ]);

    return {
      symbol,
      companyName: profile.name || symbol,
      currentPrice: quote.c,
      change: quote.d,
      percentChange: quote.dp,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      previousClose: quote.pc,
      exchange: profile.exchange,
      industry: profile.finnhubIndustry,
      logo: profile.logo,
      website: profile.weburl,
    };
  },
};