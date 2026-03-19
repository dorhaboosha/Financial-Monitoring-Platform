import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';

export const useStockSearch = (query: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['stock-search', query],
    queryFn: () => marketService.searchStocks(query),
    enabled,
  });
};