export interface WatchlistStock {
  id: string;
  symbol: string;
  createdAt: string;
}

export interface WatchlistResponse {
  success: boolean;
  data: WatchlistStock[];
}

export interface AddWatchlistStockRequest {
  symbol: string;
}

export interface AddWatchlistStockResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    symbol: string;
    createdAt: string;
  };
}

export interface RemoveWatchlistStockResponse {
  success: boolean;
  message: string;
}