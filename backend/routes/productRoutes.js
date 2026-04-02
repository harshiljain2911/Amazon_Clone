import express from 'express';
import { getProducts, getProductById, createProductReview } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Public
router.get('/',    getProducts);
router.get('/:id', getProductById);

// Protected — add review
router.post(
  '/:id/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  createProductReview
);

export default router;
