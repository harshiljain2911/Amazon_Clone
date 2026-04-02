import Order from '../models/orderModel.js';

const TAX_RATE      = 0.18;   // 18% GST
const FREE_SHIPPING = 500;    // free shipping above ₹500
const SHIPPING_COST = 60;     // flat ₹60 otherwise

/* ── Create order ── */
export const createOrderService = async (userId, { orderItems, shippingAddress, paymentMethod }) => {
  if (!orderItems || orderItems.length === 0) {
    throw Object.assign(new Error('No order items provided'), { status: 400 });
  }

  const itemsPrice    = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingPrice = itemsPrice >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const taxPrice      = parseFloat((itemsPrice * TAX_RATE).toFixed(2));
  const totalAmount   = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user:   userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalAmount,
  });

  return order;
};

/* ── Get orders for a user ── */
export const getUserOrdersService = async (userId, { page = 1, limit = 10 } = {}) => {
  const skip  = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments({ user: userId }),
  ]);
  return { orders, page: Number(page), pages: Math.ceil(total / limit), total };
};

/* ── Get single order by ID ── */
export const getOrderByIdService = async (orderId, userId, isAdmin = false) => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });

  // Non-admins can only view their own orders
  if (!isAdmin && order.user._id.toString() !== userId.toString()) {
    throw Object.assign(new Error('Not authorized to view this order'), { status: 403 });
  }
  return order;
};

/* ── Admin: get all orders (paginated) ── */
export const getAllOrdersService = async ({ page = 1, limit = 20, status } = {}) => {
  const query = status ? { orderStatus: status } : {};
  const skip  = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Order.countDocuments(query),
  ]);
  return { orders, page: Number(page), pages: Math.ceil(total / limit), total };
};

/* ── Admin: update order status ── */
export const updateOrderStatusService = async (orderId, orderStatus) => {
  const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(orderStatus)) {
    throw Object.assign(new Error(`Invalid status. Must be one of: ${allowed.join(', ')}`), { status: 400 });
  }

  const update = { orderStatus };
  if (orderStatus === 'Delivered') {
    update.isDelivered = true;
    update.deliveredAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(orderId, update, { new: true });
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
  return order;
};
