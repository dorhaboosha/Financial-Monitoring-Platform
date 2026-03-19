import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/healthRoutes';
import sessionRoutes from './routes/sessionRoutes';
import marketRoutes from './routes/marketRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import { env } from './config/env';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/', healthRoutes);
app.use('/', sessionRoutes);
app.use('/', marketRoutes);
app.use('/', watchlistRoutes);

export default app;