import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import alertRoutes from './routes/alertRoutes';
import healthRoutes from './routes/healthRoutes';
import notificationRoutes from './routes/notificationRoutes';
import sessionRoutes from './routes/sessionRoutes';
import marketRoutes from './routes/marketRoutes';
import summaryRoutes from './routes/summaryRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import { env } from './config/env';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/', healthRoutes);
app.use('/', sessionRoutes);
app.use('/', marketRoutes);
app.use('/', watchlistRoutes);
app.use('/', alertRoutes);
app.use('/', notificationRoutes);
app.use('/', summaryRoutes);

export default app;