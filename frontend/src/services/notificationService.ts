import apiClient from './apiClient';
import type {
  MarkReadResponse,
  NotificationsResponse,
} from '../types/notification';

export const notificationService = {
  getNotifications: async (): Promise<NotificationsResponse> => {
    const response = await apiClient.get('/api/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<MarkReadResponse> => {
    const response = await apiClient.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<MarkReadResponse> => {
    const response = await apiClient.put('/api/notifications/read-all');
    return response.data;
  },
};
