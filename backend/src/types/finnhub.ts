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