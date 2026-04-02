import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: localStorage.getItem('wishlistItems') ? JSON.parse(localStorage.getItem('wishlistItems')) : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const existItem = state.wishlistItems.find((x) => x._id === item._id);

      if (existItem) {
        state.wishlistItems = state.wishlistItems.filter((x) => x._id !== item._id);
      } else {
        state.wishlistItems = [...state.wishlistItems, item];
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
