export interface TickerStockItem {
    symbol: string;
    companyName: string;
    currentPrice: number;
    change: number;
    percentChange: number;
  }
  
  export interface StockSearchItem {
    symbol: string;
    displaySymbol: string;
    description: string;
    type: string;
  }
  
  export interface StockDetailsResponse {
    symbol: string;
    companyName: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    exchange?: string;
    industry?: string;
    logo?: string;
    website?: string;
  }