// src/store/features/auth/authSlice.ts
import { createSlice,type  PayloadAction } from '@reduxjs/toolkit';
import { 
  saveAuthData, 
  clearAuthData, 
  getStoredAuthData 
} from  '../../../../news/api/auth/AuthQueries';
import type {
  ApiUser,
  StoredAuthData,
} from '../../../../news/api/auth/AuthTypes';

/* -------------------------------------------------------------------------- */
/*                               STATE TYPE                                   */
/* -------------------------------------------------------------------------- */

interface AuthState {
  user: ApiUser | null;
  accessToken: string | null;
  tokenType: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/* -------------------------------------------------------------------------- */
/*                               INITIAL STATE                                */
/* -------------------------------------------------------------------------- */

const initialState: AuthState = {
  user: null,
  accessToken: null,
  tokenType: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/* -------------------------------------------------------------------------- */
/*                               AUTH SLICE                                   */
/* -------------------------------------------------------------------------- */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set auth data after successful login or registration
     * Called from the onSuccess callbacks of useLogin or useRegister hooks
     */
    setAuthData: (state, action: PayloadAction<StoredAuthData>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
      state.tokenType = action.payload.token_type;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      saveAuthData(action.payload);
    },

    /**
     * Clear all auth data on logout
     */
    clearAuthData: (state) => {
      state.user = null;
      state.accessToken = null;
      state.tokenType = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      clearAuthData();
    },

    /**
     * Hydrate auth state from stored data (called on app initialization)
     */
    hydrateAuth: (state) => {
      const storedData = getStoredAuthData();
      if (storedData && storedData.access_token) {
        state.user = storedData.user;
        state.accessToken = storedData.access_token;
        state.tokenType = storedData.token_type;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      }
    },

    /**
     * Update user data in state and storage
     * Called from useUpdateProfile onSuccess callback
     */
    updateUserData: (state, action: PayloadAction<ApiUser>) => {
      state.user = action.payload;
      const storedData = getStoredAuthData();
      if (storedData) {
        saveAuthData({
          ...storedData,
          user: action.payload,
        });
      }
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

/* -------------------------------------------------------------------------- */
/*                               ACTIONS                                      */
/* -------------------------------------------------------------------------- */

export const {
  setAuthData,
  clearAuthData: clearAuth,
  hydrateAuth,
  updateUserData,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

/* -------------------------------------------------------------------------- */
/*                               SELECTORS                                    */
/* -------------------------------------------------------------------------- */

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

/* -------------------------------------------------------------------------- */
/*                               REDUCER                                      */
/* -------------------------------------------------------------------------- */

export default authSlice.reducer;