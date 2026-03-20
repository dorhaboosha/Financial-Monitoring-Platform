import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { NOTIFICATIONS_QUERY_KEY } from './useNotifications';

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};
