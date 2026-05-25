import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

export const getRideHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let rides;
        if (role === 'DRIVER') {
            rides = await prisma.ride.findMany({
                where: { driverId: req.user.driverProfile?.id },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            rides = await prisma.ride.findMany({
                where: { riderId: userId },
                orderBy: { createdAt: 'desc' }
            });
        }

        res.status(200).json({ status: 'success', data: { rides } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const processPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { rideId, paymentMethodId } = req.body;

        const ride = await prisma.ride.findUnique({
            where: { id: rideId }
        });

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Mock payment processing
        console.log(`Processing payment for ride ${rideId} using method ${paymentMethodId}`);
        
        // In real implementation:
        // const payment = await stripe.paymentIntents.create({ ... })

        res.status(200).json({
            status: 'success',
            message: 'Payment processed successfully',
            data: {
                transactionId: `TXN-${Date.now()}`,
                amount: ride.fare
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
