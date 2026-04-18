/**
 * AuthQueries.ts
 * ============================================================================
 * AUTHENTICATION REACT QUERY HOOKS WITH REDUX INTEGRATION
 * ============================================================================
 * 
 * This file contains all React Query mutation and query hooks for authentication
 * operations. These hooks automatically update the Redux store on success.
 * 
 * @module useAuthQueries
 */

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { axiosInstance } from './../axiosConfig';
import { setAuthData, clearAuth, updateUserData, setError }  from '../../../features/authentication/store/slices/authSlice';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ApiUser,
  StoredAuthData,
} from './AuthTypes';

/* -------------------------------------------------------------------------- */
/*                               QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const authKeys = {
  all: ['auth'] as const,
  user: {
    all: () => [...authKeys.all, 'user'] as const,
    profile: () => [...authKeys.user.all(), 'profile'] as const,
  },
  session: {
    all: () => [...authKeys.all, 'session'] as const,
    status: () => [...authKeys.session.all(), 'status'] as const,
  },
};

/* -------------------------------------------------------------------------- */
/*                           TOKEN MANAGEMENT                                 */
/* -------------------------------------------------------------------------- */

const AUTH_STORAGE_KEY = 'auth_data';
const REDIRECT_PATH_KEY = 'redirect_after_auth';

export const saveAuthData = (data: StoredAuthData): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
};

export const getStoredAuthData = (): StoredAuthData | null => {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as StoredAuthData;
  } catch {
    return null;
  }
};

export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const setupAuthInterceptor = (onUnauthorized: () => void): void => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        clearAuthData();
        onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};

/* -------------------------------------------------------------------------- */
/*                           REDIRECT PATH HELPERS                            */
/* -------------------------------------------------------------------------- */

/**
 * Save the intended redirect path before login/registration
 */
export const saveRedirectPath = (path: string): void => {
  if (path && path !== '/login' && path !== '/register') {
    localStorage.setItem(REDIRECT_PATH_KEY, path);
  }
};

/**
 * Get and clear the stored redirect path
 */
export const getAndClearRedirectPath = (): string | null => {
  const path = localStorage.getItem(REDIRECT_PATH_KEY);
  if (path) {
    localStorage.removeItem(REDIRECT_PATH_KEY);
  }
  return path;
};

/**
 * Clear redirect path without retrieving it
 */
export const clearRedirectPath = (): void => {
  localStorage.removeItem(REDIRECT_PATH_KEY);
};

/* -------------------------------------------------------------------------- */
/*                         AUTHENTICATION HOOKS                               */
/* -------------------------------------------------------------------------- */

/**
 * Register a new user - Automatically updates Redux store on success
 */
export const useRegister = (
  callbacks?: {
    onSuccess?: (data: RegisterResponse, redirectPath?: string | null) => void;
    onError?: (error: AxiosError<RegisterResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<RegisterResponse, AxiosError<RegisterResponse>, RegisterRequest>({
    mutationFn: async (credentials: RegisterRequest) => {
      const response = await axiosInstance.post<RegisterResponse>('/auth/register', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data.access_token) {
        // Save to localStorage
        saveAuthData({
          access_token: data.data.access_token,
          token_type: data.data.token_type,
          user: data.data.user,
        });
        
        // Update Redux store
        dispatch(setAuthData({
          access_token: data.data.access_token,
          token_type: data.data.token_type,
          user: data.data.user,
        }));
        
        // Update React Query cache
        queryClient.setQueryData(authKeys.user.profile(), data.data.user);
        
        // Get redirect path before clearing
        const redirectPath = getAndClearRedirectPath();
        
        callbacks?.onSuccess?.(data, redirectPath);
      } else {
        callbacks?.onSuccess?.(data);
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      dispatch(setError(error.response?.data?.message || 'Registration failed'));
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Login user - Automatically updates Redux store on success
 */
export const useLogin = (
  callbacks?: {
    onSuccess?: (data: LoginResponse, redirectPath?: string | null) => void;
    onError?: (error: AxiosError<LoginResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<LoginResponse, AxiosError<LoginResponse>, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data.access_token) {
        // Save to localStorage
        saveAuthData({
          access_token: data.data.access_token,
          token_type: data.data.token_type,
          user: data.data.user,
        });
        
        // Update Redux store
        dispatch(setAuthData({
          access_token: data.data.access_token,
          token_type: data.data.token_type,
          user: data.data.user,
        }));
        
        // Update React Query cache
        queryClient.setQueryData(authKeys.user.profile(), data.data.user);
        
        // Get redirect path before clearing
        const redirectPath = getAndClearRedirectPath();
        
        callbacks?.onSuccess?.(data, redirectPath);
      } else {
        callbacks?.onSuccess?.(data);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message || error.message);
      dispatch(setError(error.response?.data?.message || 'Login failed'));
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Logout user - Automatically clears Redux store on success
 */
export const useLogout = (
  callbacks?: {
    onSuccess?: () => void;
    onError?: (error: AxiosError<LogoutResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<LogoutResponse, AxiosError<LogoutResponse>, void>({
    mutationFn: async () => {
      const response = await axiosInstance.post<LogoutResponse>('/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      // Clear localStorage
      clearAuthData();
      
      // Clear Redux store
      dispatch(clearAuth());
      
      // Clear React Query cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Logout failed:', error.response?.data?.message || error.message);
      // Still clear local data even if API call fails
      clearAuthData();
      dispatch(clearAuth());
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Get current authenticated user profile
 */
export const useGetProfile = (
  options?: Omit<UseQueryOptions<ApiUser, AxiosError<ProfileResponse>>, 'queryKey' | 'queryFn'>
) => {
  const storedData = getStoredAuthData();
  const hasToken = !!storedData?.access_token;

  return useQuery<ApiUser, AxiosError<ProfileResponse>>({
    queryKey: authKeys.user.profile(),
    queryFn: async () => {
      const response = await axiosInstance.get<ProfileResponse>('/auth/profile');
      return response.data.data.user;
    },
    enabled: hasToken,
    staleTime: 1000 * 60 * 5,
    retry: false,
    ...options,
  });
};

/**
 * Update user profile - Automatically updates Redux store on success
 */
export const useUpdateProfile = (
  callbacks?: {
    onSuccess?: (data: UpdateProfileResponse) => void;
    onError?: (error: AxiosError<UpdateProfileResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<UpdateProfileResponse, AxiosError<UpdateProfileResponse>, UpdateProfileRequest>({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await axiosInstance.put<UpdateProfileResponse>('/v1/auth/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data.user) {
        // Update React Query cache
        queryClient.setQueryData(authKeys.user.profile(), data.data.user);
        
        // Update Redux store
        dispatch(updateUserData(data.data.user));
        
        // Update localStorage
        const storedData = getStoredAuthData();
        if (storedData) {
          saveAuthData({
            ...storedData,
            user: data.data.user,
          });
        }
      }
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Profile update failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Change user password
 */
export const useChangePassword = (
  callbacks?: {
    onSuccess?: (data: ChangePasswordResponse) => void;
    onError?: (error: AxiosError<ChangePasswordResponse>) => void;
  }
) => {
  return useMutation<ChangePasswordResponse, AxiosError<ChangePasswordResponse>, ChangePasswordRequest>({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await axiosInstance.post<ChangePasswordResponse>('/auth/change-password', data);
      return response.data;
    },
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Password change failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Check if user is authenticated (has valid token)
 */
export const useIsAuthenticated = (): boolean => {
  const storedData = getStoredAuthData();
  return !!storedData?.access_token;
};

/**
 * Get current auth state with loading status
 */
export const useAuthState = () => {
  const { data: user, isLoading } = useGetProfile();
  const isAuthenticated = useIsAuthenticated();

  return {
    user: user || null,
    isAuthenticated: isAuthenticated && !!user,
    isLoading,
  };
};

/* -------------------------------------------------------------------------- */
/*                           UTILITY FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

export const extractAuthErrorMessage = (
  error: AxiosError<RegisterResponse | LoginResponse | UpdateProfileResponse | ChangePasswordResponse>,
  fallbackMessage = 'An authentication error occurred.'
): string => {
  return error.response?.data?.message || error.message || fallbackMessage;
};

export const formatAuthValidationErrors = (
  errors?: Record<string, string[]>
): string => {
  if (!errors || Object.keys(errors).length === 0) {
    return '';
  }

  return Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      return `${fieldName}: ${messages.join(', ')}`;
    })
    .join(' | ');
};

/* -------------------------------------------------------------------------- */
/*                            EXPORT ALL HOOKS                                */
/* -------------------------------------------------------------------------- */

export default {
  useGetProfile,
  useIsAuthenticated,
  useAuthState,
  useRegister,
  useLogin,
  useLogout,
  useUpdateProfile,
  useChangePassword,
  authKeys,
  saveAuthData,
  getStoredAuthData,
  clearAuthData,
  setupAuthInterceptor,
  extractAuthErrorMessage,
  formatAuthValidationErrors,
  saveRedirectPath,
  getAndClearRedirectPath,
  clearRedirectPath,
};