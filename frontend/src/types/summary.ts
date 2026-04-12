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

export interface SummaryResponse {
  success: boolean;
  data: WatchlistSummaryData;
}
