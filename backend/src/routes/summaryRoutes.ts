import { Router } from 'express';
import { getSummary } from '../controllers/summaryController';
import { resolveAnonymousUser } from '../middleware/anonymousUserMiddleware';

const summaryRoutes = Router();

summaryRoutes.get('/api/summary', resolveAnonymousUser, getSummary);

export default summaryRoutes;
