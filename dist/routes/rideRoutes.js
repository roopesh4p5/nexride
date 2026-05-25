"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rideController_1 = require("../controllers/rideController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
/**
 * @swagger
 * /rides/request:
 *   post:
 *     summary: Request a new ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pickupLocation, pickupLat, pickupLng, dropoffLocation, dropoffLat, dropoffLng]
 *             properties:
 *               pickupLocation:
 *                 type: string
 *               pickupLat:
 *                 type: number
 *               pickupLng:
 *                 type: number
 *               dropoffLocation:
 *                 type: string
 *               dropoffLat:
 *                 type: number
 *               dropoffLng:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ride requested successfully
 */
router.post('/request', (0, authMiddleware_1.restrictTo)('RIDER'), rideController_1.requestRide);
/**
 * @swagger
 * /rides/{rideId}/accept:
 *   patch:
 *     summary: Accept a ride request
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride accepted
 */
router.patch('/:rideId/accept', (0, authMiddleware_1.restrictTo)('DRIVER'), rideController_1.acceptRide);
/**
 * @swagger
 * /rides/location:
 *   post:
 *     summary: Update driver location
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lat, lng]
 *             properties:
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               rideId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location updated
 */
router.post('/location', (0, authMiddleware_1.restrictTo)('DRIVER'), rideController_1.updateLocation);
/**
 * @swagger
 * /rides/{rideId}/complete:
 *   patch:
 *     summary: Complete a ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fare:
 *                 type: number
 *               distance:
 *                 type: number
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ride completed
 */
router.patch('/:rideId/complete', (0, authMiddleware_1.restrictTo)('DRIVER'), rideController_1.completeRide);
exports.default = router;
//# sourceMappingURL=rideRoutes.js.map