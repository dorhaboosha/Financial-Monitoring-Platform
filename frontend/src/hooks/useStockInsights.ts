import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';

export const useStockInsights = (symbol: string | null) => {
  return useQuery({
    queryKey: ['stockInsights', symbol],
    queryFn: () => marketService.getStockInsights(symbol!),
    enabled: !!symbol,
  });
};
