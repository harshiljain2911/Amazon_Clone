import {
  createOrderService,
  getUserOrdersService,
  getOrderByIdService,
} from '../services/orderService.js';
import sendEmail from '../utils/sendEmail.js';

/* ── POST /api/orders ── */
export const createOrder = async (req, res, next) => {
  console.log("Order API hit");
  console.log("Incoming order data:", req.body);
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const order = await createOrderService(req.user._id, { orderItems, shippingAddress, paymentMethod });
    
    // Send Fun Demo Email
    const userName = req.user.name || req.user.email.split('@')[0];
    const orderId = order._id.toString();
    
    await sendEmail({
      to: req.user.email,
      subject: "🎉 Your Order is CONFIRMED (Kind of 😄)",
      text: `Hi ${userName},\n\nThank you for placing your order on our Amazon Clone 🛒\n\n🚀 Good news:\nYour order has been successfully placed!\n\n😅 Bad news:\nThis is just a demo project... so nothing will actually arrive.\n\nBut hey — at least your coding skills just leveled up 🔥\n\nOrder ID: ${orderId}\n\nKeep building awesome stuff 💻\n\n— Team Amazon Clone 😎`
    });

    res.status(201).json({
      message: "Order placed successfully (demo mode)",
      orderId: orderId,
      order: order
    });
  } catch (err) {
    res.status(err.status || 500);
    next(err);
  }
};

/* ── GET /api/orders/mine ── */
export const getMyOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getUserOrdersService(req.user._id, { page, limit });
    res.status(200).json(result);
  } catch (err) { next(err); }
};

/* ── GET /api/orders/:id ── */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await getOrderByIdService(req.params.id, req.user._id, req.user.isAdmin);
    res.status(200).json(order);
  } catch (err) {
    res.status(err.status || 500);
    next(err);
  }
};
