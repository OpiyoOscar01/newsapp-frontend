/**
 * Authentication Redux slice
 * Purpose: Manage authentication state, actions, and reducers using Redux Toolkit
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  type {PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { STORAGE_KEYS } from '../../../../config/api';
import type { 
  AuthState, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User 
} from '../../types/auth';
// import type { ApiError } from '../../../../shared/types/api';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginTime: null,
};

// Async thunks
export const loginAsync = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      // Store tokens in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
      }
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      
      return response;
    } catch (error: any) {
      const message = error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerAsync = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      // Store tokens in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      if (response.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
      }
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      
      return response;
    } catch (error: any) {
      const message = error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutAsync = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error: any) {
      // Even if API call fails, we should clear local state
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      const message = error.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },

    // Set authentication credentials manually (for social login, token refresh, etc.)
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refresh_token || null;
      state.isAuthenticated = true;
      state.error = null;
      state.lastLoginTime = new Date().toISOString();
    },

    // Clear all authentication data
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastLoginTime = null;
    },

    // Update user profile information
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      }
    },

    // Set loading state manually if needed
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Restore auth from localStorage (hydration)
    hydrateAuth: (state) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (token && userStr) {
        try {
          state.token = token;
          state.user = JSON.parse(userStr);
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Error hydrating auth state:', error);
          // Clear corrupted data
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refresh_token || null;
        state.isAuthenticated = true;
        state.error = null;
        state.lastLoginTime = new Date().toISOString();
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refresh_token || null;
        state.isAuthenticated = true;
        state.error = null;
        state.lastLoginTime = new Date().toISOString();
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.lastLoginTime = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.isLoading = false;
        // Clear state even if logout API call failed
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.lastLoginTime = null;
      });
  },
});

export const {
  clearError,
  setCredentials,
  clearAuth,
  updateUserProfile,
  setLoading,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;
