import { Router } from 'express';
import { getRideHistory, processPayment } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/history', getRideHistory);
router.post('/pay', processPayment);

export default router;
