import express from 'express';
import { trackProductView, trackSearchQuery } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/view').post(protect, trackProductView);
router.route('/search').post(protect, trackSearchQuery);

export default router;
