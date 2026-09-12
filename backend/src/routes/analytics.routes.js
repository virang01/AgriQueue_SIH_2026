import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('manager', 'govt_admin'), getAnalytics);

export default router;
