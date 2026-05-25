import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { driverProfile: true }
        });

        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};
