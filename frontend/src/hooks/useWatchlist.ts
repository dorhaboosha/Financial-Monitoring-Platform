import { useQuery } from '@tanstack/react-query';
import { watchlistService } from '../services/watchlistService';

export const WATCHLIST_QUERY_KEY = ['watchlist'];

export const useWatchlist = () => {
  return useQuery({
    queryKey: WATCHLIST_QUERY_KEY,
    queryFn: watchlistService.getWatchlist,
  });
};