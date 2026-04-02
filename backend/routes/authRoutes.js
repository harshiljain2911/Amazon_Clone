import express from 'express';
import { body } from 'express-validator';
import { sendOtp, verifyOtp, refreshToken, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/send-otp',
  [body('email').isEmail().withMessage('Valid email required').toLowerCase()],
  validate,
  sendOtp
);

router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email required').toLowerCase(),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits').isNumeric(),
  ],
  validate,
  verifyOtp
);

router.post('/refresh', refreshToken);
router.post('/logout',  protect, logout);
router.get('/me',       protect, getMe);

export default router;
