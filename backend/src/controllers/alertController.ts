import { Request, Response } from 'express';
import { alertService } from '../services/alertService';
import {
  createAlertSchema,
  deleteAlertParamsSchema,
} from '../validators/alertValidators';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const alerts = await alertService.getAlerts(userId);

    return res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
    });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const parsed = createAlertSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: parsed.error.flatten(),
      });
    }

    const alert = await alertService.createAlert(
      userId,
      parsed.data.symbol,
      parsed.data.type,
      parsed.data.threshold,
    );

    return res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'An identical active alert already exists') {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Failed to create alert:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create alert',
    });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const parsed = deleteAlertParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid route params',
        errors: parsed.error.flatten(),
      });
    }

    await alertService.deleteAlert(userId, parsed.data.alertId);

    return res.status(200).json({
      success: true,
      message: 'Alert deleted',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Alert not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Failed to delete alert:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete alert',
    });
  }
};
