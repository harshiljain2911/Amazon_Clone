import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Use Optional Auth so unauthenticated users can still receive generic fallback products
router.route('/').get(optionalAuth, getRecommendations);

export default router;
