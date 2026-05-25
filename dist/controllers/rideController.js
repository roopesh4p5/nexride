"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRide = exports.updateLocation = exports.acceptRide = exports.requestRide = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const socketService_1 = require("../services/socketService");
const fareService_1 = require("../services/fareService");
const requestRide = async (req, res) => {
    try {
        const { pickupLocation, pickupLat, pickupLng, dropoffLocation, dropoffLat, dropoffLng } = req.body;
        const riderId = req.user.id;
        const fare = (0, fareService_1.estimateFare)(pickupLat, pickupLng, dropoffLat, dropoffLng);
        const ride = await prisma_1.default.ride.create({
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
        (0, socketService_1.emitToAll)('ride_requested', {
            rideId: ride.id,
            pickupLocation,
            pickupLat,
            pickupLng
        });
        res.status(201).json({ status: 'success', data: { ride } });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.requestRide = requestRide;
const acceptRide = async (req, res) => {
    try {
        const { rideId } = req.params;
        const driverId = req.user.driverProfile?.id;
        if (!driverId) {
            return res.status(403).json({ message: 'Only drivers can accept rides' });
        }
        const ride = await prisma_1.default.ride.update({
            where: { id: rideId },
            data: {
                driverId,
                status: 'ACCEPTED'
            },
            include: { driver: { include: { user: true } } }
        });
        // Notify rider that the ride was accepted
        (0, socketService_1.emitToRide)(ride.id, 'ride_accepted', {
            rideId: ride.id,
            driver: {
                name: ride.driver?.user.name,
                vehicleModel: ride.driver?.vehicleModel,
                vehiclePlate: ride.driver?.vehiclePlate
            }
        });
        res.status(200).json({ status: 'success', data: { ride } });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.acceptRide = acceptRide;
const updateLocation = async (req, res) => {
    try {
        const { lat, lng, rideId } = req.body;
        const driverId = req.user.driverProfile?.id;
        if (!driverId) {
            return res.status(403).json({ message: 'Only drivers can update location' });
        }
        await prisma_1.default.driver.update({
            where: { id: driverId },
            data: { currentLat: lat, currentLng: lng }
        });
        if (rideId) {
            (0, socketService_1.emitToRide)(rideId, 'driver_location', { lat, lng });
        }
        res.status(200).json({ status: 'success', message: 'Location updated' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.updateLocation = updateLocation;
const completeRide = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { fare, distance, duration } = req.body;
        const ride = await prisma_1.default.ride.update({
            where: { id: rideId },
            data: {
                status: 'COMPLETED',
                fare,
                distance,
                duration,
                completedAt: new Date()
            }
        });
        (0, socketService_1.emitToRide)(rideId, 'ride_completed', { ride });
        res.status(200).json({ status: 'success', data: { ride } });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.completeRide = completeRide;
//# sourceMappingURL=rideController.js.map