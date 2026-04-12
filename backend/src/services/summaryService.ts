import { finnhubService } from './finnhubService';
import { watchlistRepository } from '../repositories/watchlistRepository';

export interface SummaryStockItem {
  symbol: string;
  changePercent: number;
  currentPrice: number;
}

export interface WatchlistSummaryData {
  totalStocks: number;
  biggestGainer: SummaryStockItem | null;
  biggestLoser: SummaryStockItem | null;
  averageDailyChange: number | null;
}

export const summaryService = {
  getSummary: async (userId: string): Promise<WatchlistSummaryData> => {
    const stocks = await watchlistRepository.findAllByUserId(userId);

    if (stocks.length === 0) {
      return {
        totalStocks: 0,
        biggestGainer: null,
        biggestLoser: null,
        averageDailyChange: null,
      };
    }

    const quoteResults = await Promise.allSettled(
      stocks.map((s) => finnhubService.getQuote(s.symbol).then((q) => ({ symbol: s.symbol, quote: q }))),
    );

    const items: SummaryStockItem[] = [];

    for (const result of quoteResults) {
      if (result.status === 'fulfilled') {
        const { symbol, quote } = result.value;
        if (quote && quote.c > 0) {
          items.push({
            symbol,
            changePercent: quote.dp ?? 0,
            currentPrice: quote.c,
          });
        }
      }
    }

    if (items.length === 0) {
      return {
        totalStocks: stocks.length,
        biggestGainer: null,
        biggestLoser: null,
        averageDailyChange: null,
      };
    }

    const sorted = [...items].sort((a, b) => b.changePercent - a.changePercent);
    const biggestGainer = sorted[0];
    const biggestLoser = sorted[sorted.length - 1];
    const averageDailyChange =
      items.reduce((sum, item) => sum + item.changePercent, 0) / items.length;

    return {
      totalStocks: stocks.length,
      biggestGainer,
      biggestLoser: biggestLoser !== biggestGainer ? biggestLoser : null,
      averageDailyChange: Math.round(averageDailyChange * 100) / 100,
    };
  },
};
