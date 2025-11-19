// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  email_verified_at?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerified: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isVerified: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isVerified: false,
        });
        return;
      }

      // Try to get user data from cache first
      const cachedUser = apiClient.getUserData();
      if (cachedUser) {
        setAuthState({
          user: cachedUser,
          isAuthenticated: true,
          isLoading: false,
          isVerified: !!cachedUser.email_verified_at,
        });
      }

      // Verify with server
      const userData = await apiClient.get<User>('/user');
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        isVerified: !!userData.email_verified_at,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.removeToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isVerified: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/auth/login', {
        email,
        password,
      });
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isVerified: !!response.user.email_verified_at,
      });
      
      return { success: true, user: response.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  }, []);

  const register = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/auth/register', userData);
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isVerified: false,
      });
      
      return { success: true, user: response.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.removeToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isVerified: false,
      });
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      const updatedUser = await apiClient.put<User>('/auth/profile', profileData);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      return { success: true, user: updatedUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const changePassword = useCallback(async (passwordData: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      await apiClient.post('/auth/change-password', passwordData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for auth events
    const handleAuthRequired = () => {
      setAuthState(prev => ({ ...prev, isAuthenticated: false }));
    };

    window.addEventListener('auth-required', handleAuthRequired);
    return () => window.removeEventListener('auth-required', handleAuthRequired);
  }, [checkAuth]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
  };
};