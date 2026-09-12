import express from 'express';
import {
  getLiveQueue,
  checkInFarmerToken,
  callNextToken,
  getMyBookings,
  cancelBooking,
} from '../controllers/queueController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/live', getLiveQueue);
router.get('/my-bookings', protect, authorize('farmer', 'govt_admin'), getMyBookings);
router.post('/check-in', protect, authorize('staff', 'manager', 'govt_admin'), checkInFarmerToken);
router.post('/call-next', protect, authorize('staff', 'manager', 'govt_admin'), callNextToken);
router.put('/:id/cancel', protect, authorize('farmer', 'govt_admin'), cancelBooking);

export default router;
