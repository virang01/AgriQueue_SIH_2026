import express from 'express';
import { registerUser, loginUser, getMe, updateMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateFields } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/register', validateFields(['name', 'phone', 'password']), registerUser);
router.post('/login', validateFields(['phone', 'password']), loginUser);
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateMe);
router.put('/me', protect, updateMe);

export default router;
