import { Request, Response } from 'express';
import { anonymousUserService } from '../services/anonymousUserService';
import { env } from '../config/env';

export const initializeSession = async (req: Request, res: Response) => {
  try {
    const existingAnonymousId = req.cookies[env.anonymousCookieName];

    const result = await anonymousUserService.getOrCreateAnonymousUser(existingAnonymousId);

    if (result.isNew || existingAnonymousId !== result.anonymousId) {
      res.cookie(env.anonymousCookieName, result.anonymousId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    res.status(200).json({
      success: true,
      anonymousId: result.anonymousId,
      isNew: result.isNew,
    });
  } catch (error) {
    console.error('Failed to initialize session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize session',
    });
  }
};