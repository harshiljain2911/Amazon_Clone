import { generateRecommendations } from '../services/recommendationEngine.js';
import Product from '../models/productModel.js';

// @desc    Get AI-driven personalized recommendations
// @route   GET /api/recommendations
// @access  Public (Gracefully handles unauthenticated generic browsing)
export const getRecommendations = async (req, res) => {
  try {
    // Check if the user is authenticated natively
    if (req.user && req.user._id) {
      // Return custom structured arrays based strictly on MongoDB logic
      const mlData = await generateRecommendations(req.user._id);
      return res.status(200).json(mlData);
    }

    // Unauthenticated Guest Browser Fallback Strategy
    // We fetch generic high-rated / trending datasets since we don't hold session cookies natively yet.
    const genericPopular = await Product.find({})
      .sort({ rating: -1, numReviews: -1 })
      .limit(8);

    const genericTrending = await Product.find({})
      .sort({ numReviews: -1 })
      .limit(8);

    return res.status(200).json({
      becauseYouViewed: genericPopular,
      recommendedForYou: genericTrending
    });
    
  } catch (error) {
    console.error(`Error resolving AI recommendations: ${error.message}`);
    res.status(500).json({ message: 'Failed to build recommendation aggregates' });
  }
};
