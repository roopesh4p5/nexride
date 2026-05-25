import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);
app.use('/payments', paymentRoutes);

export default app;
