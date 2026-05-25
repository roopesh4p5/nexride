import { Router } from 'express';
import { getRideHistory, processPayment } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get ride history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ride history retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/history', getRideHistory);

/**
 * @swagger
 * /payments/pay:
 *   post:
 *     summary: Process a payment for a ride
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rideId, paymentMethodId]
 *             properties:
 *               rideId:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Server error
 */
router.post('/pay', processPayment);

export default router;
