import express from 'express';
import { getAvailableSlots, bookSlot, createBatchSlots } from '../controllers/slotController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { validateFields } from '../middlewares/validateRequest.js';

const router = express.Router();

router.get('/', getAvailableSlots);
router.post('/book', protect, authorize('farmer', 'govt_admin'), validateFields(['slotId', 'cropType', 'estimatedQuantityQuintals']), bookSlot);
router.post('/create-batch', protect, authorize('manager', 'govt_admin'), validateFields(['centreId', 'date']), createBatchSlots);

export default router;
