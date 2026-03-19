import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';

export const useStockDetails = (symbol: string | null) => {
  return useQuery({
    queryKey: ['stockDetails', symbol],
    queryFn: () => marketService.getStockDetails(symbol!),
    enabled: !!symbol,
  });
};
