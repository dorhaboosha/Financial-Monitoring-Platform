const REQUIRED_ENV_VARS = ['DATABASE_URL', 'FINNHUB_API_KEY'] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key] || process.env[key]!.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        'Copy backend/.env.example to backend/.env and fill in the values.',
    );
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  anonymousCookieName: process.env.ANONYMOUS_COOKIE_NAME || 'anonymous_id',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  finnhubApiKey: process.env.FINNHUB_API_KEY!,
};