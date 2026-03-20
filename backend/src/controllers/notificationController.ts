import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { z } from 'zod';

const markReadParamsSchema = z.object({
  notificationId: z.string().uuid('Invalid notification ID'),
});

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const notifications = await notificationService.getNotifications(userId);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    const parsed = markReadParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid route params',
        errors: parsed.error.flatten(),
      });
    }

    await notificationService.markAsRead(userId, parsed.data.notificationId);

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Notification not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Failed to mark notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
    });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.anonymousUserDbId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Anonymous user not resolved',
      });
    }

    await notificationService.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
    });
  }
};
