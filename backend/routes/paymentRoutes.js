import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendRazorpayId,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect); // all payment routes are protected

router.get('/config', sendRazorpayId);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);

export default router;
