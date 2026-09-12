import express from 'express';
import { getAdminOverview } from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/overview', protect, authorize('govt_admin'), getAdminOverview);

export default router;
