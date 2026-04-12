import { useQuery } from '@tanstack/react-query';
import { summaryService } from '../services/summaryService';

export const SUMMARY_QUERY_KEY = ['summary'];

export const useSummary = () => {
  return useQuery({
    queryKey: SUMMARY_QUERY_KEY,
    queryFn: summaryService.getSummary,
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
};
