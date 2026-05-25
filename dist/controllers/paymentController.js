"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = exports.getRideHistory = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getRideHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let rides;
        if (role === 'DRIVER') {
            rides = await prisma_1.default.ride.findMany({
                where: { driverId: req.user.driverProfile?.id },
                orderBy: { createdAt: 'desc' }
            });
        }
        else {
            rides = await prisma_1.default.ride.findMany({
                where: { riderId: userId },
                orderBy: { createdAt: 'desc' }
            });
        }
        res.status(200).json({ status: 'success', data: { rides } });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.getRideHistory = getRideHistory;
const processPayment = async (req, res) => {
    try {
        const { rideId, paymentMethodId } = req.body;
        const ride = await prisma_1.default.ride.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.processPayment = processPayment;
//# sourceMappingURL=paymentController.js.map