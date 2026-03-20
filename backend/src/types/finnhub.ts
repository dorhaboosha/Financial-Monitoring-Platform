export interface FinnhubQuoteResponse {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
  }
  
  export interface FinnhubSymbolSearchItem {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }
  
  export interface FinnhubSymbolSearchResponse {
    count: number;
    result: FinnhubSymbolSearchItem[];
  }
  
  export interface FinnhubCompanyProfileResponse {
    country?: string;
    currency?: string;
    exchange?: string;
    finnhubIndustry?: string;
    ipo?: string;
    logo?: string;
    marketCapitalization?: number;
    name?: string;
    phone?: string;
    shareOutstanding?: number;
    ticker?: string;
    weburl?: string;
  }
  
  export interface FinnhubStockSymbolItem {
    currency: string;
    description: string;
    displaySymbol: string;
    figi?: string;
    mic?: string;
    symbol: string;
    type: string;
  }

  export interface FinnhubBasicFinancialsResponse {
    metric: Record<string, number | string | null>;
    metricType: string;
    symbol: string;
  }

  export interface FinnhubRecommendationTrend {
    buy: number;
    hold: number;
    sell: number;
    strongBuy: number;
    strongSell: number;
    period: string;
    symbol: string;
  }

  export interface FinnhubPriceTargetResponse {
    lastUpdated: string;
    symbol: string;
    targetHigh: number;
    targetLow: number;
    targetMean: number;
    targetMedian: number;
  }

  export interface FinnhubCompanyNewsItem {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
  }