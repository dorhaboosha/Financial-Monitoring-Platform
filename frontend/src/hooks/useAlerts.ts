import { useQuery } from '@tanstack/react-query';
import { alertService } from '../services/alertService';

export const ALERTS_QUERY_KEY = ['alerts'];

export const useAlerts = () => {
  return useQuery({
    queryKey: ALERTS_QUERY_KEY,
    queryFn: alertService.getAlerts,
  });
};
