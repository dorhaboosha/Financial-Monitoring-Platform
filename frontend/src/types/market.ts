export interface TickerStockItem {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  percentChange: number;
}

export interface TickerStocksResponse {
  success: boolean;
  data: TickerStockItem[];
}

export interface StockSearchItem {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

export interface StockSearchResponse {
  success: boolean;
  data: StockSearchItem[];
}

export interface StockDetails {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  exchange?: string;
  industry?: string;
  logo?: string;
  website?: string;
  marketCap?: number;
}

export interface StockDetailsResponse {
  success: boolean;
  data: StockDetails;
}

export interface KeyMetrics {
  peRatio?: number;
  weekHigh52?: number;
  weekLow52?: number;
  beta?: number;
  dividendYield?: number;
}

export interface RecommendationTrend {
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
  period: string;
}

export interface PriceTarget {
  targetHigh: number;
  targetLow: number;
  targetMean: number;
  targetMedian: number;
  lastUpdated: string;
}

export interface CompanyNewsItem {
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  image: string;
}

export interface StockInsights {
  symbol: string;
  metrics: KeyMetrics;
  recommendation: RecommendationTrend | null;
  priceTarget: PriceTarget | null;
  news: CompanyNewsItem[];
}

export interface StockInsightsResponse {
  success: boolean;
  data: StockInsights;
}
