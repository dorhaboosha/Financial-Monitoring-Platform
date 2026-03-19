export interface TickerStockItem {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  percentChange: number;
}

export interface TickerStocksResponse {
  success: boolean;
  data: TickerStockItem[];
}