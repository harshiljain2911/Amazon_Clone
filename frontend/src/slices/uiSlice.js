import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartDrawerOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCartDrawer: (state, action) => {
      // If payload is provided, use it, else toggle
      state.isCartDrawerOpen = action.payload !== undefined ? action.payload : !state.isCartDrawerOpen;
    },
    openQuickView: (state, action) => {
      state.isQuickViewOpen = true;
      state.quickViewProduct = action.payload;
    },
    closeQuickView: (state) => {
      state.isQuickViewOpen = false;
      state.quickViewProduct = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { toggleCartDrawer, openQuickView, closeQuickView, setSearchQuery } = uiSlice.actions;

export default uiSlice.reducer;
