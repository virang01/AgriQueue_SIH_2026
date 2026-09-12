import express from 'express';
import { getCentres, createCentre, getCentreById } from '../controllers/centreController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', getCentres);
router.get('/:id', getCentreById);
router.post('/', protect, authorize('govt_admin'), createCentre);

export default router;
