import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user info to setup initial state headers if needed
const getUserToken = (getState) => {
  const userInfo = getState().user?.userInfo;
  return userInfo?.token ? `Bearer ${userInfo.token}` : null;
};

// --- ASYNC THUNKS ---
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getUserToken(getState);
      if (!token) return [];
      
      const config = { headers: { Authorization: token } };
      const { data } = await axios.get('http://localhost:5000/api/cart', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToCartDB = createAsyncThunk(
  'cart/addToCartDB',
  async ({ item, qty }, { getState, rejectWithValue }) => {
    try {
      const token = getUserToken(getState);
      const config = { headers: { Authorization: token } };

      const payload = {
        _id: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: qty
      };

      const { data } = await axios.post('http://localhost:5000/api/cart/add', payload, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update remote cart');
    }
  }
);

export const clearCartDB = createAsyncThunk(
  'cart/clearCartDB',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getUserToken(getState);
      const config = { headers: { Authorization: token } };
      await axios.delete('http://localhost:5000/api/cart/clear', config);
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);


const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reducer specifically to wipe cart on logout natively
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload; // Map MongoDB remote directly
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add/Update/Remove Cart — backend returns the full normalized cart array
      .addCase(addToCartDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartDB.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCartDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Cart sync failed:', action.payload);
      })
      // Clear Cart
      .addCase(clearCartDB.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartTotals = (state) => {
  const itemsCount = state.cart.cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;
  const totalPrice = state.cart.cartItems?.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2) || "0.00";
  return { itemsCount, totalPrice };
};

export default cartSlice.reducer;
