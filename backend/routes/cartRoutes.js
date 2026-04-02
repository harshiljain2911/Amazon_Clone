import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, addToCart, removeFromCart, updateCartQty, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.use(protect);   // all cart routes require auth

router.get('/',           getCart);
router.post('/add',       addToCart);        // backward compat
router.delete('/clear',   clearCart);        // DELETE /api/cart/clear
router.delete('/:id',     removeFromCart);   // DELETE /api/cart/:productId
router.put('/:id',        updateCartQty);    // PUT    /api/cart/:productId { qty }

export default router;
