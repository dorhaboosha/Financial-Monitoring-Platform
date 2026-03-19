import { z } from 'zod';

export const searchStocksQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search query is required'),
});