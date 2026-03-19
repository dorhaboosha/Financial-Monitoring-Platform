import { v4 as uuidv4 } from 'uuid';
import { anonymousUserRepository } from '../repositories/anonymousUserRepository';

export const anonymousUserService = {
  getOrCreateAnonymousUser: async (existingAnonymousId?: string) => {
    if (existingAnonymousId) {
      const existingUser = await anonymousUserRepository.findByAnonymousId(existingAnonymousId);

      if (existingUser) {
        return {
          user: existingUser,
          isNew: false,
          anonymousId: existingUser.anonymousId,
        };
      }
    }

    const newAnonymousId = uuidv4();
    const newUser = await anonymousUserRepository.create(newAnonymousId);

    return {
      user: newUser,
      isNew: true,
      anonymousId: newUser.anonymousId,
    };
  },
};