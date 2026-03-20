import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { env } from './config/env';
import { startAlertCheckerJob } from './jobs/alertCheckerJob';
import { tickerCacheService } from './services/tickerCacheService';

const startServer = async () => {
  try {
    await tickerCacheService.initialize();

    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
      startAlertCheckerJob();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();