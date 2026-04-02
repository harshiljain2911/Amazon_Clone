import { getWishlistService, toggleWishlistService } from '../services/wishlistService.js';

export const getWishlist = async (req, res, next) => {
  try {
    const products = await getWishlistService(req.user._id);
    res.status(200).json(products);
  } catch (err) { next(err); }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { products, action } = await toggleWishlistService(req.user._id, req.body._id);
    res.status(200).json(products);
  } catch (err) { next(err); }
};
