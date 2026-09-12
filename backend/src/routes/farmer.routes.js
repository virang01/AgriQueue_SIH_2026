import express from 'express';
import { getFarmerProfile, updateFarmerProfile } from '../controllers/farmerController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('farmer', 'govt_admin'));

router.get('/profile', getFarmerProfile);
router.put('/profile', updateFarmerProfile);

export default router;
