import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

export default app;
