import { FinnhubStockSymbolItem } from '../types/finnhub';
import { TickerStockItem } from '../types/market';
import { finnhubService } from './finnhubService';
import { pickRandomBatch } from '../utils/tickerHelpers';

const SYMBOL_POOL_REFRESH_MS = 24 * 60 * 60 * 1000;
const TICKER_BATCH_REFRESH_MS = 5 * 60 * 1000;
const TICKER_BATCH_SIZE = 12;

let cachedSymbolPool: FinnhubStockSymbolItem[] = [];
let cachedTickerBatch: TickerStockItem[] = [];
let lastSymbolPoolRefreshAt = 0;
let lastTickerBatchRefreshAt = 0;

const isUsCommonStock = (item: FinnhubStockSymbolItem): boolean => {
  const hasSymbol = Boolean(item.symbol);
  const looksNormalSymbol = /^[A-Z.\-]+$/.test(item.symbol);
  const typeMatches =
    item.type?.toLowerCase() === 'common stock' ||
    item.type?.toLowerCase() === 'stock';

  return hasSymbol && looksNormalSymbol && typeMatches;
};

const deduplicateBySymbol = (items: FinnhubStockSymbolItem[]): FinnhubStockSymbolItem[] => {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.symbol)) return false;
    seen.add(item.symbol);
    return true;
  });
};

const refreshSymbolPool = async (): Promise<void> => {
  const symbols = await finnhubService.getStockSymbolsByExchange('US');
  cachedSymbolPool = deduplicateBySymbol(symbols.filter(isUsCommonStock));
  lastSymbolPoolRefreshAt = Date.now();
};

const buildTickerBatch = async (): Promise<void> => {
  if (cachedSymbolPool.length === 0) {
    await refreshSymbolPool();
  }

  const selectedSymbols = pickRandomBatch(cachedSymbolPool, TICKER_BATCH_SIZE);

  const batch = await Promise.all(
    selectedSymbols.map(async (item) => {
      const [quote, profile] = await Promise.all([
        finnhubService.getQuote(item.symbol),
        finnhubService.getCompanyProfile(item.symbol),
      ]);

      return {
        symbol: item.symbol,
        companyName: profile.name || item.description || item.symbol,
        currentPrice: quote.c,
        change: quote.d,
        percentChange: quote.dp,
      };
    })
  );

  cachedTickerBatch = batch.filter(
    (item) =>
      typeof item.currentPrice === 'number' &&
      Number.isFinite(item.currentPrice) &&
      typeof item.percentChange === 'number' &&
      Number.isFinite(item.percentChange)
  );

  lastTickerBatchRefreshAt = Date.now();
};

export const tickerCacheService = {
  initialize: async (): Promise<void> => {
    await refreshSymbolPool();
    await buildTickerBatch();
  },

  refreshSymbolPoolIfNeeded: async (): Promise<void> => {
    const now = Date.now();

    if (
      now - lastSymbolPoolRefreshAt >= SYMBOL_POOL_REFRESH_MS ||
      cachedSymbolPool.length === 0
    ) {
      await refreshSymbolPool();
    }
  },

  refreshTickerBatchIfNeeded: async (): Promise<void> => {
    await tickerCacheService.refreshSymbolPoolIfNeeded();

    const now = Date.now();

    if (
      now - lastTickerBatchRefreshAt >= TICKER_BATCH_REFRESH_MS ||
      cachedTickerBatch.length === 0
    ) {
      await buildTickerBatch();
    }
  },

  getTickerBatch: async (): Promise<TickerStockItem[]> => {
    await tickerCacheService.refreshTickerBatchIfNeeded();
    return cachedTickerBatch;
  },

  getRandomSymbolSuggestions: async (count: number = 5) => {
    await tickerCacheService.refreshSymbolPoolIfNeeded();
    return pickRandomBatch(cachedSymbolPool, count);
  },
};