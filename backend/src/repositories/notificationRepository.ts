import prisma from '../config/prisma';

export const notificationRepository = {
  findAllByUserId: async (userId: string) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { triggeredAt: 'desc' },
    });
  },

  markAsRead: async (notificationId: string, userId: string) => {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  },

  markAllAsRead: async (userId: string) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  create: async (data: {
    userId: string;
    alertId: string;
    symbol: string;
    message: string;
  }) => {
    return prisma.notification.create({ data });
  },

  findByIdAndUserId: async (notificationId: string, userId: string) => {
    return prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
  },

  findRecentByAlertId: async (alertId: string, windowMs: number) => {
    const since = new Date(Date.now() - windowMs);
    return prisma.notification.findFirst({
      where: {
        alertId,
        triggeredAt: { gte: since },
      },
    });
  },
};
