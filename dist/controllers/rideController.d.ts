import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const requestRide: (req: AuthRequest, res: Response) => Promise<void>;
export declare const acceptRide: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLocation: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const completeRide: (req: AuthRequest, res: Response) => Promise<void>;
