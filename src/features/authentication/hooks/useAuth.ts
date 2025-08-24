/**
 * Authentication custom hooks
 * Purpose: Encapsulate authentication logic and provide clean API for components
 */
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import {
  loginAsync,
  registerAsync,
  logoutAsync,
  clearError,
  hydrateAuth,
} from '../store/slices/authSlice';
import {
  selectUser,
  selectUserProfile,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectAuthStatus,
} from '../store/selectors/authSelector';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useAppSelector(selectUser);
  const userProfile = useAppSelector(selectUserProfile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);
  const authStatus = useAppSelector(selectAuthStatus);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const result = await dispatch(loginAsync(credentials));
      
      if (loginAsync.fulfilled.match(result)) {
        toast.success('Login successful!');
        return { success: true, data: result.payload };
      } else {
        const errorMessage = result.payload || 'Login failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Register function
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      const result = await dispatch(registerAsync(userData));
      
      if (registerAsync.fulfilled.match(result)) {
        toast.success('Account created successfully!');
        return { success: true, data: result.payload };
      } else {
        const errorMessage = result.payload || 'Registration failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAsync());
      toast.success('Logged out successfully');
      navigate('/login');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Logout failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch, navigate]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Hydrate auth state on mount
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return {
    // State
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    error,
    authStatus,

    // Actions
    login,
    register,
    logout,
    clearAuthError,
  };
};

// Hook for protected routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};

// Hook for guest-only routes (login, register)
export const useGuestOnly = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};
