import { AlertType } from '@prisma/client';
import { alertRepository } from '../repositories/alertRepository';

export const alertService = {
  getAlerts: async (userId: string) => {
    return alertRepository.findAllByUserId(userId);
  },

  createAlert: async (userId: string, symbol: string, type: AlertType, threshold: number) => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    const existing = await alertRepository.findByUserIdAndSymbolAndType(
      userId,
      normalizedSymbol,
      type,
      threshold,
    );

    if (existing) {
      throw new Error('An identical active alert already exists');
    }

    return alertRepository.create({
      userId,
      symbol: normalizedSymbol,
      type,
      threshold,
    });
  },

  deleteAlert: async (userId: string, alertId: string) => {
    const alert = await alertRepository.findByIdAndUserId(alertId, userId);

    if (!alert) {
      throw new Error('Alert not found');
    }

    await alertRepository.deleteByIdAndUserId(alertId, userId);
  },
};
