import prisma from '../config/prisma';

export const watchlistRepository = {
  findAllByUserId: async (userId: string) => {
    return prisma.watchlistStock.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByUserIdAndSymbol: async (userId: string, symbol: string) => {
    return prisma.watchlistStock.findUnique({
      where: {
        userId_symbol: {
          userId,
          symbol,
        },
      },
    });
  },

  create: async (userId: string, symbol: string) => {
    return prisma.watchlistStock.create({
      data: {
        userId,
        symbol,
      },
    });
  },

  deleteByUserIdAndSymbol: async (userId: string, symbol: string) => {
    return prisma.watchlistStock.delete({
      where: {
        userId_symbol: {
          userId,
          symbol,
        },
      },
    });
  },
};