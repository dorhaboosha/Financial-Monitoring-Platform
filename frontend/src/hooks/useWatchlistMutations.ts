import { useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistService } from '../services/watchlistService';
import { WATCHLIST_QUERY_KEY } from './useWatchlist';

export const useAddWatchlistStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchlistService.addStockToWatchlist,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: WATCHLIST_QUERY_KEY });
    },
  });
};

export const useRemoveWatchlistStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchlistService.removeStockFromWatchlist,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: WATCHLIST_QUERY_KEY });
    },
  });
};