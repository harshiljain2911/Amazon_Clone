import User from '../models/userModel.js';
import mongoose from 'mongoose';

// @desc    Track a viewed product
// @route   POST /api/activity/view
// @access  Private
export const trackProductView = async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate object ID format to prevent database crashes
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      // Remove product if it already exists to maintain sequence order
      const existingKey = user.viewedProducts.findIndex(
        (id) => id.toString() === productId
      );

      if (existingKey !== -1) {
        user.viewedProducts.splice(existingKey, 1);
      }

      // Prepend newest product view natively
      user.viewedProducts.unshift(productId);

      // Max buffer size is 20 to prevent array bloating
      if (user.viewedProducts.length > 20) {
        user.viewedProducts.pop();
      }

      await user.save();
      res.status(200).json({ message: 'Product view tracked securely' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`Error tracking product view: ${error.message}`);
    res.status(500).json({ message: 'Failed to track product view' });
  }
};

// @desc    Track a search query String
// @route   POST /api/activity/search
// @access  Private
export const trackSearchQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Valid query is required' });
    }

    const queryString = query.toLowerCase().trim();
    const user = await User.findById(req.user._id);

    if (user) {
      const existingKey = user.recentSearches.indexOf(queryString);

      // Remove string if it already exists natively
      if (existingKey !== -1) {
        user.recentSearches.splice(existingKey, 1);
      }

      // Prepend the new query directly into string space memory
      user.recentSearches.unshift(queryString);

      // Restrict historical searches to 15 records
      if (user.recentSearches.length > 15) {
        user.recentSearches.pop();
      }

      await user.save();
      res.status(200).json({ message: 'Search tracked securely' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`Error tracking search query: ${error.message}`);
    res.status(500).json({ message: 'Failed to track search query' });
  }
};
