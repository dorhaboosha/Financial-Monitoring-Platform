import { Router } from 'express';
import {
  getSearchSuggestions,
  getStockDetails,
  getTickerStocks,
  searchStocks,
} from '../controllers/marketController';

const marketRoutes = Router();

marketRoutes.get('/api/market/ticker', getTickerStocks);
marketRoutes.get('/api/market/search-suggestions', getSearchSuggestions);
marketRoutes.get('/api/market/search', searchStocks);
marketRoutes.get('/api/market/stocks/:symbol', getStockDetails);

export default marketRoutes;