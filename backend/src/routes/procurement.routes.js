import express from 'express';
import { recordProcurementWeighment, getProcurementRecords } from '../controllers/procurementController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('staff', 'manager', 'govt_admin'), recordProcurementWeighment);
router.get('/', authorize('staff', 'manager', 'govt_admin'), getProcurementRecords);

export default router;
