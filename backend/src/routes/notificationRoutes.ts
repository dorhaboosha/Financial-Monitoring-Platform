import { Router } from 'express';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../controllers/notificationController';
import { resolveAnonymousUser } from '../middleware/anonymousUserMiddleware';

const notificationRoutes = Router();

notificationRoutes.get('/api/notifications', resolveAnonymousUser, getNotifications);
notificationRoutes.put('/api/notifications/read-all', resolveAnonymousUser, markAllNotificationsAsRead);
notificationRoutes.put('/api/notifications/:notificationId/read', resolveAnonymousUser, markNotificationAsRead);

export default notificationRoutes;
