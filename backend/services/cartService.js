import Cart from '../models/cartModel.js';

/* ── Normalize for frontend ── */
const normalize = (items) =>
  items.map((item) => ({
    _id:   item.product.toString(),
    name:  item.name,
    image: item.image,
    price: item.price,
    qty:   item.qty,
  }));

/* ── Get or create cart ── */
const getOrCreate = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, cartItems: [] });
  return cart;
};

export const getCartService = async (userId) => {
  const cart = await getOrCreate(userId);
  return normalize(cart.cartItems);
};

export const addToCartService = async (userId, { _id, name, image, price, qty }) => {
  const finalQty = qty !== undefined ? Number(qty) : 1;
  const cart     = await getOrCreate(userId);

  const idx = cart.cartItems.findIndex((i) => i.product.toString() === _id.toString());

  if (idx > -1) {
    if (finalQty <= 0) cart.cartItems.splice(idx, 1);
    else cart.cartItems[idx].qty = finalQty;
  } else if (finalQty > 0) {
    cart.cartItems.push({ product: _id, name, image, price, qty: finalQty });
  }

  await cart.save();
  return normalize(cart.cartItems);
};

export const removeFromCartService = async (userId, productId) => {
  const cart = await getOrCreate(userId);
  cart.cartItems = cart.cartItems.filter((i) => i.product.toString() !== productId.toString());
  await cart.save();
  return normalize(cart.cartItems);
};

export const updateCartQtyService = async (userId, productId, qty) => {
  if (Number(qty) <= 0) return removeFromCartService(userId, productId);

  const cart = await getOrCreate(userId);
  const idx  = cart.cartItems.findIndex((i) => i.product.toString() === productId.toString());
  if (idx === -1) throw Object.assign(new Error('Item not in cart'), { status: 404 });

  cart.cartItems[idx].qty = Number(qty);
  await cart.save();
  return normalize(cart.cartItems);
};

export const clearCartService = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { cartItems: [] });
  return [];
};
