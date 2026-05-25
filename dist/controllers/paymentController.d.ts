import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const getRideHistory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const processPayment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
