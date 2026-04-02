import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Cart from '../models/cartModel.js';

/**
 * Placeholder AI Recommendation Engine.
 * Designed to be modular so an external Stitch MCP / ML Python module 
 * can natively override this logic without breaking the Controller API signatures.
 */
export const generateRecommendations = async (userId) => {
  let recommendedForYou = [];
  let becauseYouViewed = [];

  try {
    // 1. Fetch User Telemetry and Cart Data
    // We intentionally fetch this dynamically to prevent replicating active carts into the User schema natively.
    const user = await User.findById(userId).populate('viewedProducts');
    const userCart = await Cart.findOne({ user: userId });

    const activeCartIds = userCart ? userCart.cartItems.map(item => item.product.toString()) : [];
    const viewedProductIds = user.viewedProducts ? user.viewedProducts.map(p => p._id.toString()) : [];
    const recentSearches = user.recentSearches || [];

    // Base Exclusion list (Don't recommend items they already have in their cart or recently viewed!)
    const exclusionList = [...activeCartIds, ...viewedProductIds];

    // --- LOGIC A: "Because You Viewed This" ---
    if (user.viewedProducts && user.viewedProducts.length > 0) {
      // Find the primary categories they are looking at
      const recentCategories = [...new Set(user.viewedProducts.slice(0, 3).map(p => p.category))];

      becauseYouViewed = await Product.find({
        category: { $in: recentCategories },
        _id: { $nin: exclusionList }
      })
      .sort({ rating: -1, numReviews: -1 })
      .limit(8);
    } else {
      // Fallback if they haven't viewed anything yet: High rated generic
      becauseYouViewed = await Product.find({ _id: { $nin: exclusionList } })
        .sort({ rating: -1, numReviews: -1 })
        .limit(8);
    }


    // --- LOGIC B: "Recommended For You" ---
    // If they searched something, bias the recommendations towards that string
    let searchBias = {};
    if (recentSearches.length > 0) {
      const topSearch = recentSearches[0];
      searchBias = {
        $or: [
          { name: { $regex: topSearch, $options: 'i' } },
          { category: { $regex: topSearch, $options: 'i' } },
        ]
      };
    }

    // Always exclude things we already put in the "Because You Viewed" list
    const recommendedExclusions = [...exclusionList, ...becauseYouViewed.map(p => p._id.toString())];

    recommendedForYou = await Product.find({
      ...searchBias,
      _id: { $nin: recommendedExclusions }
    })
    .sort({ rating: -1 }) // Bias towards high ratings based on search heuristic
    .limit(8);

    // If search yielded nothing, fallback to pure generic trending
    if (recommendedForYou.length === 0) {
      recommendedForYou = await Product.find({ _id: { $nin: recommendedExclusions } })
        .sort({ numReviews: -1 }) // Trending essentially means high review count organically
        .limit(8);
    }
    
    return {
      recommendedForYou,
      becauseYouViewed
    };

  } catch (error) {
    console.error(`Recommendation Engine Failure: ${error.message}`);
    
    // Fallback response guarantees UI doesn't crash if Mongo aggregation fails
    const fallback = await Product.find({}).sort({ rating: -1 }).limit(8);
    return {
      recommendedForYou: fallback,
      becauseYouViewed: fallback
    };
  }
};
