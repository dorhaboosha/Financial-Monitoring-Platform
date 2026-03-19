import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/marketService';

export const useStockSearchSuggestions = () => {
  return useQuery({
    queryKey: ['stock-search-suggestions'],
    queryFn: marketService.getSearchSuggestions,
  });
};