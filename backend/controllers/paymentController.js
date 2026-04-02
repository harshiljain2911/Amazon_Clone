import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/orderModel.js';

// @desc    Get Razorpay config / ID
// @route   GET /api/payment/config
// @access  Private
export const sendRazorpayId = (req, res) => {
  res.status(200).json({ keyId: process.env.RAZORPAY_KEY_ID });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;
    
    if (!amount || !orderId) {
       return res.status(400).json({ message: 'Amount and orderId are required' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test', // Mock fallback if env misses
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret',
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${orderId}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    if (!err.status) res.status(500);
    next(err);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mongoOrderId,
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'secret';
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find the order and update it
      const order = await Order.findById(mongoOrderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentId = razorpay_payment_id;
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'Successful validation',
          updateTime: new Date().toISOString(),
          emailAddress: req.user.email,
        };

        await order.save();

        res.status(200).json({
          success: true,
          message: 'Payment verified and order updated',
        });
      } else {
        res.status(404);
        throw new Error('Order not found after payment');
      }
    } else {
      res.status(400);
      throw new Error('Invalid signature. Payment verification failed.');
    }
  } catch (err) {
    next(err);
  }
};
