import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export const useNotifications = () => {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: notificationService.getNotifications,
    refetchInterval: 60_000,
  });
};
