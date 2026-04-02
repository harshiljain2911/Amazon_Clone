import {
  createOrderService,
  getUserOrdersService,
  getOrderByIdService,
} from '../services/orderService.js';

/* ── POST /api/orders ── */
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const order = await createOrderService(req.user._id, { orderItems, shippingAddress, paymentMethod });
    res.status(201).json(order);
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
