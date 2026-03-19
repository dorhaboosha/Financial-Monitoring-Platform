import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { anonymousUserRepository } from '../repositories/anonymousUserRepository';

declare global {
  namespace Express {
    interface Request {
      anonymousUserId?: string;
      anonymousUserDbId?: string;
    }
  }
}

export const resolveAnonymousUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const anonymousId = req.cookies[env.anonymousCookieName];

    if (!anonymousId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous session not initialized',
      });
    }

    const user = await anonymousUserRepository.findByAnonymousId(anonymousId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not found',
      });
    }

    req.anonymousUserId = user.anonymousId;
    req.anonymousUserDbId = user.id;

    next();
  } catch (error) {
    console.error('Failed to resolve anonymous user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve anonymous user',
    });
  }
};