import { Router } from 'express';
import { initializeSession } from '../controllers/sessionController';

const sessionRoutes = Router();

sessionRoutes.post('/api/session/init', initializeSession);

export default sessionRoutes;