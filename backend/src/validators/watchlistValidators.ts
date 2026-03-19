import { z } from 'zod';

export const addWatchlistStockSchema = z.object({
  symbol: z.string().trim().min(1, 'Symbol is required'),
});

export const removeWatchlistStockParamsSchema = z.object({
  symbol: z.string().trim().min(1, 'Symbol is required'),
});