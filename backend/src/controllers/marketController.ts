import { Request, Response } from 'express';
import { marketService } from '../services/marketService';
import { searchStocksQuerySchema } from '../validators/marketValidators';

export const getTickerStocks = async (_req: Request, res: Response) => {
  try {
    const stocks = await marketService.getTickerStocks();

    res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    console.error('Failed to fetch ticker stocks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticker stocks',
    });
  }
};

export const searchStocks = async (req: Request, res: Response) => {
  try {
    const parsed = searchStocksQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid search query',
        errors: parsed.error.flatten(),
      });
    }

    const stocks = await marketService.searchStocks(parsed.data.q);

    return res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    console.error('Failed to search stocks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search stocks',
    });
  }
};

export const getStockDetails = async (req: Request, res: Response) => {
  try {
    const rawSymbol = req.params.symbol;

    if (!rawSymbol || Array.isArray(rawSymbol)) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required',
      });
    }
    
    const stock = await marketService.getStockDetails(rawSymbol);

    return res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    console.error('Failed to fetch stock details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stock details',
    });
  }
};

export const getStockInsights = async (req: Request, res: Response) => {
  try {
    const rawSymbol = req.params.symbol;

    if (!rawSymbol || Array.isArray(rawSymbol)) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required',
      });
    }

    const insights = await marketService.getStockInsights(rawSymbol);

    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Failed to fetch stock insights:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stock insights',
    });
  }
};

export const getSearchSuggestions = async (_req: Request, res: Response) => {
  try {
    const stocks = await marketService.getSearchSuggestions();

    return res.status(200).json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    console.error('Failed to fetch search suggestions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch search suggestions',
    });
  }
};