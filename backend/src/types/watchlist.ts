export interface AddWatchlistStockRequest {
    symbol: string;
  }
  
  export interface WatchlistStockResponse {
    id: string;
    symbol: string;
    createdAt: Date;
  }