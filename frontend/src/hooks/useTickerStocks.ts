import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';

export const TICKER_STOCKS_QUERY_KEY = ['ticker-stocks'];

export const useTickerStocks = () => {
  return useQuery({
    queryKey: TICKER_STOCKS_QUERY_KEY,
    queryFn: marketService.getTickerStocks,
    refetchInterval: 5 * 60 * 1000,
  });
};