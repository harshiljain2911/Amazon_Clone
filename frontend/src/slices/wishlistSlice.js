import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- HELPERS ---
const getUserToken = (getState) => {
  const userInfo = getState().user?.userInfo;
  return userInfo?.token ? `Bearer ${userInfo.token}` : null;
};

// --- ASYNC THUNKS ---
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getUserToken(getState);
      if (!token) return [];
      
      const config = { headers: { Authorization: token } };
      const { data } = await axios.get('http://localhost:5000/api/wishlist', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleWishlistDB = createAsyncThunk(
  'wishlist/toggleWishlistDB',
  async (product, { getState, rejectWithValue }) => {
    try {
      const token = getUserToken(getState);
      const config = { headers: { Authorization: token } };
      
      const { data } = await axios.post('http://localhost:5000/api/wishlist/toggle', { _id: product._id }, config);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync wishlist');
    }
  }
);


const initialState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload; // Direct remote dump
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Post API automatically returns the new list, so we map it cleanly
      .addCase(toggleWishlistDB.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
