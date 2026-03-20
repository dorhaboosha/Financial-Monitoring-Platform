import { AlertType } from '@prisma/client';
import prisma from '../config/prisma';

export const alertRepository = {
  findAllActive: async () => {
    return prisma.alert.findMany({
      where: { isActive: true },
    });
  },

  findAllByUserId: async (userId: string) => {
    return prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByUserIdAndSymbolAndType: async (
    userId: string,
    symbol: string,
    type: AlertType,
    threshold: number,
  ) => {
    return prisma.alert.findFirst({
      where: { userId, symbol, type, threshold, isActive: true },
    });
  },

  create: async (data: {
    userId: string;
    symbol: string;
    type: AlertType;
    threshold: number;
  }) => {
    return prisma.alert.create({ data });
  },

  deleteByIdAndUserId: async (alertId: string, userId: string) => {
    return prisma.alert.deleteMany({
      where: { id: alertId, userId },
    });
  },

  findByIdAndUserId: async (alertId: string, userId: string) => {
    return prisma.alert.findFirst({
      where: { id: alertId, userId },
    });
  },
};
