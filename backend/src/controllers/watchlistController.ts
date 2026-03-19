import { Request, Response } from 'express';
import { watchlistService } from '../services/watchlistService';
import {
  addWatchlistStockSchema,
  removeWatchlistStockParamsSchema,
} from '../validators/watchlistValidators';

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const watchlist = await watchlistService.getWatchlist(userId);

    return res.status(200).json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error('Failed to fetch watchlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist',
    });
  }
};

export const addWatchlistStock = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const parsed = addWatchlistStockSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: parsed.error.flatten(),
      });
    }

    const stock = await watchlistService.addStockToWatchlist(
      userId,
      parsed.data.symbol
    );

    return res.status(201).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Stock already exists in watchlist') {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Failed to add stock to watchlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add stock to watchlist',
    });
  }
};

export const removeWatchlistStock = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const parsed = removeWatchlistStockParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid route params',
        errors: parsed.error.flatten(),
      });
    }

    await watchlistService.removeStockFromWatchlist(userId, parsed.data.symbol);

    return res.status(200).json({
      success: true,
      message: 'Stock removed from watchlist',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Stock not found in watchlist') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Failed to remove stock from watchlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove stock from watchlist',
    });
  }
};