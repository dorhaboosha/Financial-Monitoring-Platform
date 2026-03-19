export const env = {
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  anonymousCookieName: process.env.ANONYMOUS_COOKIE_NAME || 'anonymous_id',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  finnhubApiKey: process.env.FINNHUB_API_KEY || '',
};