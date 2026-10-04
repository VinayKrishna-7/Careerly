import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi.js';

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      return rejectWithValue('No token stored');
    }
    const data = await authApi.getMe();
    return data.data.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await authApi.register(userData);
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
    }
    return data.data.user;
  } catch (error) {
    return rejectWithValue(error.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.login(credentials);
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
    }
    return data.data.user;
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    localStorage.removeItem('token');
    return null;
  } catch (error) {
    localStorage.removeItem('token');
    return rejectWithValue(error.message);
  }
});

export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async (profileData, { rejectWithValue }) => {
  try {
    const data = await authApi.updateProfile(profileData);
    return data.data.user;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update profile');
  }
});

const hasInitialToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('token'));

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: hasInitialToken,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        localStorage.removeItem('token');
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })

      // updateUserProfile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
