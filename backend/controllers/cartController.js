import {
  getCartService,
  addToCartService,
  removeFromCartService,
  updateCartQtyService,
  clearCartService,
} from '../services/cartService.js';

export const getCart = async (req, res, next) => {
  try {
    const items = await getCartService(req.user._id);
    res.status(200).json(items);
  } catch (err) { next(err); }
};

export const addToCart = async (req, res, next) => {
  try {
    const items = await addToCartService(req.user._id, req.body);
    res.status(200).json(items);
  } catch (err) { next(err); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const items = await removeFromCartService(req.user._id, req.params.id);
    res.status(200).json(items);
  } catch (err) { next(err); }
};

export const updateCartQty = async (req, res, next) => {
  try {
    const items = await updateCartQtyService(req.user._id, req.params.id, req.body.qty);
    res.status(200).json(items);
  } catch (err) { next(err); }
};

export const clearCart = async (req, res, next) => {
  try {
    const items = await clearCartService(req.user._id);
    res.status(200).json(items);
  } catch (err) { next(err); }
};
