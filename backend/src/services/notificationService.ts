import { notificationRepository } from '../repositories/notificationRepository';

export const notificationService = {
  getNotifications: async (userId: string) => {
    return notificationRepository.findAllByUserId(userId);
  },

  markAsRead: async (userId: string, notificationId: string) => {
    const notification = await notificationRepository.findByIdAndUserId(notificationId, userId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notificationRepository.markAsRead(notificationId, userId);
  },

  markAllAsRead: async (userId: string) => {
    await notificationRepository.markAllAsRead(userId);
  },
};
