import prisma from '../config/prisma';

export const anonymousUserRepository = {
  findByAnonymousId: async (anonymousId: string) => {
    return prisma.anonymousUser.findUnique({
      where: { anonymousId },
    });
  },

  create: async (anonymousId: string) => {
    return prisma.anonymousUser.create({
      data: { anonymousId },
    });
  },
};