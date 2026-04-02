import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetUsers,
  adminToggleUserRole,
  adminGetDashboard,
  adminToggleUserBlock
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, isAdmin);

/* ── Dashboard ── */
router.get('/dashboard',           adminGetDashboard);

/* ── Products ── */
router.post('/products',           adminCreateProduct);
router.put('/products/:id',        adminUpdateProduct);
router.delete('/products/:id',     adminDeleteProduct);

/* ── Orders ── */
router.get('/orders',              adminGetOrders);
router.put('/orders/:id/status',   adminUpdateOrderStatus);

/* ── Users ── */
router.get('/users',               adminGetUsers);
router.put('/users/:id/role',      adminToggleUserRole);
router.put('/users/:id/block',     adminToggleUserBlock);

export default router;
