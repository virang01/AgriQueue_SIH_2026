import express from 'express';
import { getPayments, updatePaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getPayments);
router.put('/:id/status', authorize('manager', 'govt_admin'), updatePaymentStatus);

export default router;
