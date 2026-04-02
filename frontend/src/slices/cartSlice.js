import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      if (qty === 0) {
        state.cartItems = state.cartItems.filter((x) => x._id !== id);
      } else {
        state.cartItems = state.cartItems.map((x) =>
          x._id === id ? { ...x, qty } : x
        );
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selector to calculate total items and price
export const selectCartTotals = (state) => {
  const itemsCount = state.cart.cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = state.cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  return { itemsCount, totalPrice };
};

export default cartSlice.reducer;
