import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/healthRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/', healthRoutes);

export default app;