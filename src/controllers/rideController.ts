import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';
import { emitToRide, emitToAll } from '../services/socketService';
import { estimateFare } from '../services/fareService';

export const requestRide = async (req: AuthRequest, res: Response) => {
    try {
        const { pickupLocation, pickupLat, pickupLng, dropoffLocation, dropoffLat, dropoffLng } = req.body;
        const riderId = req.user.id;

        const fare = estimateFare(pickupLat, pickupLng, dropoffLat, dropoffLng);

        const ride = await prisma.ride.create({
            data: {
                riderId,
                pickupLocation,
                pickupLat,
                pickupLng,
                dropoffLocation,
                dropoffLat,
                dropoffLng,
                status: 'REQUESTED',
                fare
            }
        });

        // Notify all available drivers about the new request
        emitToAll('ride_requested', {
            rideId: ride.id,
            pickupLocation,
            pickupLat,
            pickupLng
        });

        res.status(201).json({ status: 'success', data: { ride } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const acceptRide = async (req: AuthRequest, res: Response) => {
    try {
        const { rideId } = req.params as { rideId: string };
        const driverId = req.user.driverProfile?.id;

        if (!driverId) {
            return res.status(403).json({ message: 'Only drivers can accept rides' });
        }

        const ride: any = await prisma.ride.update({
            where: { id: rideId },
            data: {
                driverId,
                status: 'ACCEPTED'
            },
            include: { driver: { include: { user: true } } }
        });

        // Notify rider that the ride was accepted
        emitToRide(ride.id, 'ride_accepted', {
            rideId: ride.id,
            driver: {
                name: ride.driver?.user.name,
                vehicleModel: ride.driver?.vehicleModel,
                vehiclePlate: ride.driver?.vehiclePlate
            }
        });

        res.status(200).json({ status: 'success', data: { ride } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng, rideId } = req.body;
        const driverId = req.user.driverProfile?.id;

        if (!driverId) {
            return res.status(403).json({ message: 'Only drivers can update location' });
        }

        await prisma.driver.update({
            where: { id: driverId },
            data: { currentLat: lat, currentLng: lng }
        });

        if (rideId) {
            emitToRide(rideId, 'driver_location', { lat, lng });
        }

        res.status(200).json({ status: 'success', message: 'Location updated' });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const completeRide = async (req: AuthRequest, res: Response) => {
    try {
        const { rideId } = req.params as { rideId: string };
        const { fare, distance, duration } = req.body;

        const ride = await prisma.ride.update({
            where: { id: rideId },
            data: {
                status: 'COMPLETED',
                fare,
                distance,
                duration,
                completedAt: new Date()
            }
        });

        emitToRide(rideId, 'ride_completed', { ride });

        res.status(200).json({ status: 'success', data: { ride } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
