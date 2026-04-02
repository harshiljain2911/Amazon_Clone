import Wishlist from '../models/wishlistModel.js';

export const getWishlistService = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist.products;
};

export const toggleWishlistService = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = new Wishlist({ user: userId, products: [] });

  const idx = wishlist.products.indexOf(productId);
  const action = idx > -1 ? 'removed' : 'added';
  if (idx > -1) wishlist.products.splice(idx, 1);
  else wishlist.products.push(productId);

  await wishlist.save();

  const updated = await Wishlist.findById(wishlist._id).populate('products');
  return { products: updated.products, action };
};
