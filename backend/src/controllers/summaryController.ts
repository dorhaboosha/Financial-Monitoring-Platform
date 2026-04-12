import { Request, Response } from 'express';
import { summaryService } from '../services/summaryService';

export const getSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId!;
    const summary = await summaryService.getSummary(userId);
    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error('Failed to fetch watchlist summary:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch watchlist summary' });
  }
};
