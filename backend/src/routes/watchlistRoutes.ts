import { Router } from 'express';
import {
  addWatchlistStock,
  getWatchlist,
  removeWatchlistStock,
} from '../controllers/watchlistController';
import { resolveAnonymousUser } from '../middleware/anonymousUserMiddleware';

const watchlistRoutes = Router();

watchlistRoutes.get('/api/watchlist', resolveAnonymousUser, getWatchlist);
watchlistRoutes.post('/api/watchlist', resolveAnonymousUser, addWatchlistStock);
watchlistRoutes.delete('/api/watchlist/:symbol', resolveAnonymousUser, removeWatchlistStock);

export default watchlistRoutes;