import { Router } from 'express';
import { requestRide, acceptRide, updateLocation, completeRide } from '../controllers/rideController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/request', restrictTo('RIDER'), requestRide);
router.patch('/:rideId/accept', restrictTo('DRIVER'), acceptRide);
router.post('/location', restrictTo('DRIVER'), updateLocation);
router.patch('/:rideId/complete', restrictTo('DRIVER'), completeRide);

export default router;
