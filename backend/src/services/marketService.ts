import { finnhubService } from './finnhubService';
import { tickerCacheService } from './tickerCacheService';
import {
  StockDetailsResponse,
  StockInsightsResponse,
  StockSearchItem,
  TickerStockItem,
} from '../types/market';

export const marketService = {
  getTickerStocks: async (): Promise<TickerStockItem[]> => {
    return tickerCacheService.getTickerBatch();
  },

  getSearchSuggestions: async (): Promise<StockSearchItem[]> => {
    const suggestions = await tickerCacheService.getRandomSymbolSuggestions(5);

    return suggestions.map((item) => ({
      symbol: item.symbol,
      displaySymbol: item.displaySymbol,
      description: item.description,
      type: item.type,
    }));
  },

  searchStocks: async (query: string): Promise<StockSearchItem[]> => {
    const response = await finnhubService.searchSymbols(query);
    const seen = new Set<string>();

    return response.result.reduce<StockSearchItem[]>((acc, item) => {
      if (!seen.has(item.symbol)) {
        seen.add(item.symbol);
        acc.push({
          symbol: item.symbol,
          displaySymbol: item.displaySymbol,
          description: item.description,
          type: item.type,
        });
      }
      return acc;
    }, []);
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
      marketCap: profile.marketCapitalization,
    };
  },

  getStockInsights: async (symbol: string): Promise<StockInsightsResponse> => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const toDate = now.toISOString().slice(0, 10);
    const fromDate = weekAgo.toISOString().slice(0, 10);

    const [financials, recommendations, priceTarget, news] = await Promise.allSettled([
      finnhubService.getBasicFinancials(symbol),
      finnhubService.getRecommendationTrends(symbol),
      finnhubService.getPriceTarget(symbol),
      finnhubService.getCompanyNews(symbol, fromDate, toDate),
    ]);

    const metricsRaw = financials.status === 'fulfilled' ? financials.value.metric : {};

    const metrics = {
      peRatio: typeof metricsRaw['peBasicExclExtraTTM'] === 'number' ? metricsRaw['peBasicExclExtraTTM'] : undefined,
      weekHigh52: typeof metricsRaw['52WeekHigh'] === 'number' ? metricsRaw['52WeekHigh'] : undefined,
      weekLow52: typeof metricsRaw['52WeekLow'] === 'number' ? metricsRaw['52WeekLow'] : undefined,
      beta: typeof metricsRaw['beta'] === 'number' ? metricsRaw['beta'] : undefined,
      dividendYield: typeof metricsRaw['dividendYieldIndicatedAnnual'] === 'number' ? metricsRaw['dividendYieldIndicatedAnnual'] : undefined,
    };

    const latestRec = recommendations.status === 'fulfilled' && recommendations.value.length > 0
      ? (() => {
          const r = recommendations.value[0];
          return { buy: r.buy, hold: r.hold, sell: r.sell, strongBuy: r.strongBuy, strongSell: r.strongSell, period: r.period };
        })()
      : null;

    const pt = priceTarget.status === 'fulfilled' && priceTarget.value.targetMedian
      ? {
          targetHigh: priceTarget.value.targetHigh,
          targetLow: priceTarget.value.targetLow,
          targetMean: priceTarget.value.targetMean,
          targetMedian: priceTarget.value.targetMedian,
          lastUpdated: priceTarget.value.lastUpdated,
        }
      : null;

    const newsItems = news.status === 'fulfilled'
      ? news.value.slice(0, 3).map((item) => ({
          headline: item.headline,
          summary: item.summary,
          source: item.source,
          url: item.url,
          datetime: item.datetime,
          image: item.image,
        }))
      : [];

    return { symbol, metrics, recommendation: latestRec, priceTarget: pt, news: newsItems };
  },
};