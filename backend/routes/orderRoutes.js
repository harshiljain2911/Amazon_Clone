import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('orderItems').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('shippingAddress.fullName').notEmpty().withMessage('Full name required'),
    body('shippingAddress.phone').notEmpty().withMessage('Phone required'),
    body('shippingAddress.addressLine').notEmpty().withMessage('Address required'),
    body('shippingAddress.city').notEmpty().withMessage('City required'),
    body('shippingAddress.pincode').notEmpty().withMessage('Pincode required'),
    body('paymentMethod').notEmpty().withMessage('Payment method required'),
  ],
  validate,
  createOrder
);

router.get('/mine', getMyOrders);
router.get('/:id',  getOrderById);

export default router;
