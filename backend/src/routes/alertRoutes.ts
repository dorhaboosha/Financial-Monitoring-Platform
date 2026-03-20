import { Router } from 'express';
import {
  createAlert,
  deleteAlert,
  getAlerts,
} from '../controllers/alertController';
import { resolveAnonymousUser } from '../middleware/anonymousUserMiddleware';

const alertRoutes = Router();

alertRoutes.get('/api/alerts', resolveAnonymousUser, getAlerts);
alertRoutes.post('/api/alerts', resolveAnonymousUser, createAlert);
alertRoutes.delete('/api/alerts/:alertId', resolveAnonymousUser, deleteAlert);

export default alertRoutes;
