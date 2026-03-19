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

export interface StockSearchItem {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

export interface StockSearchResponse {
  success: boolean;
  data: StockSearchItem[];
}