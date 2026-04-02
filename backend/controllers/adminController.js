import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductsService,
} from '../services/productService.js';
import {
  getAllOrdersService,
  updateOrderStatusService,
} from '../services/orderService.js';
import {
  getDashboardStatsService,
  toggleUserBlockService
} from '../services/adminService.js';
import User from '../models/userModel.js';

/* ════════ DASHBOARD ════════ */

/* ── GET /api/admin/dashboard ── */
export const adminGetDashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json(stats);
  } catch (err) { next(err); }
};

/* ════════ PRODUCT MANAGEMENT ════════ */

/* ── POST /api/admin/products ── */
export const adminCreateProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ── PUT /api/admin/products/:id ── */
export const adminUpdateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    res.status(200).json(product);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ── DELETE /api/admin/products/:id ── */
export const adminDeleteProduct = async (req, res, next) => {
  try {
    await deleteProductService(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ════════ ORDER MANAGEMENT ════════ */

/* ── GET /api/admin/orders ── */
export const adminGetOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const result = await getAllOrdersService({ page, limit, status });
    res.status(200).json(result);
  } catch (err) { next(err); }
};

/* ── PUT /api/admin/orders/:id/status ── */
export const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatusService(req.params.id, req.body.orderStatus);
    res.status(200).json(order);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ════════ USER MANAGEMENT ════════ */

/* ── GET /api/admin/users ── */
export const adminGetUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip  = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(),
    ]);
    res.status(200).json({ users, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (err) { next(err); }
};

/* ── PUT /api/admin/users/:id/role ── */
export const adminToggleUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); return next(new Error('User not found')); }
    user.isAdmin = !user.isAdmin;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, isBlocked: user.isBlocked });
  } catch (err) { next(err); }
};

/* ── PUT /api/admin/users/:id/block ── */
export const adminToggleUserBlock = async (req, res, next) => {
  try {
    const user = await toggleUserBlockService(req.params.id);
    res.status(200).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, isBlocked: user.isBlocked });
  } catch (err) { res.status(err.status || 500); next(err); }
};
