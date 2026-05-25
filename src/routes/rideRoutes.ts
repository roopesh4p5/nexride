import { Router } from 'express';
import { requestRide, acceptRide, updateLocation, completeRide } from '../controllers/rideController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

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
router.post('/request', restrictTo('RIDER'), requestRide);

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
router.patch('/:rideId/accept', restrictTo('DRIVER'), acceptRide);

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
router.post('/location', restrictTo('DRIVER'), updateLocation);

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
router.patch('/:rideId/complete', restrictTo('DRIVER'), completeRide);

export default router;
