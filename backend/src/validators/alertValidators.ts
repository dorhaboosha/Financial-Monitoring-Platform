import { z } from 'zod';

export const createAlertSchema = z.object({
  symbol: z.string().trim().min(1, 'Symbol is required'),
  type: z.enum([
    'PRICE_ABOVE',
    'PRICE_BELOW',
    'PERCENT_CHANGE_ABOVE',
    'PERCENT_CHANGE_BELOW',
  ]),
  threshold: z.number().positive('Threshold must be a positive number'),
});

export const deleteAlertParamsSchema = z.object({
  alertId: z.string().uuid('Invalid alert ID'),
});
