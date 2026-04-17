/**
 * ============================================================================
 * AUTHENTICATION REACT QUERY HOOKS
 * ============================================================================
 * 
 * This file contains all React Query mutation and query hooks for authentication
 * operations including register, login, logout, profile management, and
 * password change functionality.
 * 
 * @module useAuthQueries
 * @description Provides type-safe, reusable hooks for all authentication
 * operations with automatic token management and toast notifications.
 * 
 * @requires @tanstack/react-query
 * @requires axios
 */

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from './../axiosConfig';
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

/**
 * Centralized query keys for React Query caching and invalidation.
 * Hierarchical structure enables precise cache management for auth data.
 */
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

/**
 * Storage key for auth data in localStorage
 */
const AUTH_STORAGE_KEY = 'auth_data';

/**
 * Save auth data to localStorage
 */
export const saveAuthData = (data: StoredAuthData): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  // Set default authorization header for all future requests
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
};

/**
 * Get stored auth data from localStorage
 */
export const getStoredAuthData = (): StoredAuthData | null => {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as StoredAuthData;
  } catch {
    return null;
  }
};

/**
 * Clear auth data from localStorage and reset axios headers
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  delete axiosInstance.defaults.headers.common['Authorization'];
};

/**
 * Initialize axios interceptor for 401 responses
 */
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
/*                         AUTHENTICATION HOOKS                               */
/* -------------------------------------------------------------------------- */

/**
 * Register a new user
 * 
 * @param callbacks - Optional onSuccess and onError callbacks
 * @returns Mutation object with mutate function and state
 * 
 * @example
 * const { mutate: register, isLoading } = useRegister({
 *   onSuccess: (data) => {
 *     console.log('Registration successful', data);
 *     navigate('/dashboard');
 *   },
 *   onError: (error) => {
 *     console.error('Registration failed', error.response?.data?.message);
 *   }
 * });
 * 
 * register({
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   email: 'john@example.com',
 *   password: 'password123',
 *   password_confirmation: 'password123'
 * });
 */
export const useRegister = (
  callbacks: {
    onSuccess?: (data: RegisterResponse) => void;
    onError?: (error: AxiosError<RegisterResponse>) => void;
  } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, AxiosError<RegisterResponse>, RegisterRequest>({
    mutationFn: async (credentials: RegisterRequest) => {
      const response = await axiosInstance.post<RegisterResponse>('/auth/register', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data.access_token) {
        // Save auth data to storage
        saveAuthData({
          access_token: data.data.access_token,
          token_type: data.data.token_type,
          user: data.data.user,
        });
        
        // Update query cache with user data
        queryClient.setQueryData(authKeys.user.profile(), data.data.user);
      }
      callbacks.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      callbacks.onError?.(error);
    },
  });
};

/**
 * Login user
 * 
 * @param callbacks - Optional onSuccess and onError callbacks
 * @returns Mutation object with mutate function and state
 * 
 * @example
 * const { mutate: login, isLoading } = useLogin({
 *   onSuccess: (data) => {
 *     console.log('Login successful', data);
 *     navigate('/dashboard');
 *   },
 *   onError: (error) => {
 *     console.error('Login failed', error.response?.data?.message);
 *   }
 * });
 * 
 * login({
 *   email: 'john@example.com',
 *   password: 'password123'
 * });
 */
export const useLogin = (
  callbacks: {
    onSuccess?: (data: LoginResponse) => void;
    onError?: (error: AxiosError<LoginResponse>) => void;
  } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, AxiosError<LoginResponse>, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data.access_token) {
        // Save auth data to storage
        saveAuthData({
          access_token: data.data.access_token,
          token_type: data.data.token_type,
          user: data.data.user,
        });
        
        // Update query cache with user data
        queryClient.setQueryData(authKeys.user.profile(), data.data.user);
      }
      callbacks.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message || error.message);
      callbacks.onError?.(error);
    },
  });
};

/**
 * Logout user
 * 
 * @param callbacks - Optional onSuccess and onError callbacks
 * @returns Mutation object with mutate function and state
 * 
 * @example
 * const { mutate: logout } = useLogout({
 *   onSuccess: () => {
 *     navigate('/login');
 *   }
 * });
 * 
 * logout();
 */
export const useLogout = (
  callbacks: {
    onSuccess?: () => void;
    onError?: (error: AxiosError<LogoutResponse>) => void;
  } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, AxiosError<LogoutResponse>, void>({
    mutationFn: async () => {
      const response = await axiosInstance.post<LogoutResponse>('/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      // Clear auth data from storage
      clearAuthData();
      
      // Clear all auth-related queries from cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      
      callbacks.onSuccess?.();
    },
    onError: (error) => {
      console.error('Logout failed:', error.response?.data?.message || error.message);
      // Still clear local data even if API call fails
      clearAuthData();
      callbacks.onError?.(error);
    },
  });
};

/**
 * Get current authenticated user profile
 * 
 * @param options - React Query options for customizing behavior
 * @returns Query result with user profile
 * 
 * @example
 * const { data: profile, isLoading, refetch } = useGetProfile();
 * 
 * if (profile?.data.user) {
 *   console.log('User email:', profile.data.user.email);
 * }
 */
export const useGetProfile = (
  options?: Omit<UseQueryOptions<ApiUser, AxiosError<ProfileResponse>>, 'queryKey' | 'queryFn'>
) => {
  // Check if we have stored auth data
  const storedData = getStoredAuthData();
  const hasToken = !!storedData?.access_token;

  return useQuery<ApiUser, AxiosError<ProfileResponse>>({
    queryKey: authKeys.user.profile(),
    queryFn: async () => {
      const response = await axiosInstance.get<ProfileResponse>('/auth/profile');
      return response.data.data.user;
    },
    enabled: hasToken, // Only fetch if we have a token
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    ...options,
  });
};

/**
 * Update user profile
 * 
 * @param callbacks - Optional onSuccess and onError callbacks
 * @returns Mutation object with mutate function and state
 * 
 * @example
 * const { mutate: updateProfile } = useUpdateProfile({
 *   onSuccess: (data) => {
 *     toast.success('Profile updated successfully');
 *   }
 * });
 * 
 * updateProfile({
 *   name: 'John Updated',
 *   email: 'john.updated@example.com'
 * });
 */
export const useUpdateProfile = (
  callbacks: {
    onSuccess?: (data: UpdateProfileResponse) => void;
    onError?: (error: AxiosError<UpdateProfileResponse>) => void;
  } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, AxiosError<UpdateProfileResponse>, UpdateProfileRequest>({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await axiosInstance.put<UpdateProfileResponse>('/v1/auth/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data.user) {
        // Update user data in cache
        queryClient.setQueryData(authKeys.user.profile(), data.data.user);
        
        // Update stored user data
        const storedData = getStoredAuthData();
        if (storedData) {
          saveAuthData({
            ...storedData,
            user: data.data.user,
          });
        }
      }
      callbacks.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Profile update failed:', error.response?.data?.message || error.message);
      callbacks.onError?.(error);
    },
  });
};

/**
 * Change user password
 * 
 * @param callbacks - Optional onSuccess and onError callbacks
 * @returns Mutation object with mutate function and state
 * 
 * @example
 * const { mutate: changePassword } = useChangePassword({
 *   onSuccess: () => {
 *     toast.success('Password changed successfully');
 *     navigate('/profile');
 *   }
 * });
 * 
 * changePassword({
 *   current_password: 'oldpassword',
 *   password: 'newpassword123',
 *   password_confirmation: 'newpassword123'
 * });
 */
export const useChangePassword = (
  callbacks: {
    onSuccess?: (data: ChangePasswordResponse) => void;
    onError?: (error: AxiosError<ChangePasswordResponse>) => void;
  } = {}
) => {
  return useMutation<ChangePasswordResponse, AxiosError<ChangePasswordResponse>, ChangePasswordRequest>({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await axiosInstance.post<ChangePasswordResponse>('/auth/change-password', data);
      return response.data;
    },
    onSuccess: (data) => {
      callbacks.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Password change failed:', error.response?.data?.message || error.message);
      callbacks.onError?.(error);
    },
  });
};

/**
 * Check if user is authenticated (has valid token)
 * 
 * @returns Boolean indicating if user is authenticated
 * 
 * @example
 * const isAuthenticated = useIsAuthenticated();
 * if (!isAuthenticated) {
 *   navigate('/login');
 * }
 */
export const useIsAuthenticated = (): boolean => {
  const storedData = getStoredAuthData();
  return !!storedData?.access_token;
};

/**
 * Get current auth state with loading status
 * 
 * @returns Auth state object with user, loading status, and authentication flag
 * 
 * @example
 * const { user, isAuthenticated, isLoading } = useAuthState();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <Navigate to="/login" />;
 * return <div>Welcome, {user?.name}!</div>;
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

/**
 * Helper function to extract error message from Axios error
 */
export const extractAuthErrorMessage = (
  error: AxiosError<RegisterResponse | LoginResponse | UpdateProfileResponse | ChangePasswordResponse>,
  fallbackMessage = 'An authentication error occurred.'
): string => {
  return error.response?.data?.message || error.message || fallbackMessage;
};

/**
 * Helper function to format validation errors from auth responses
 */
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
  // Query hooks
  useGetProfile,
  useIsAuthenticated,
  useAuthState,
  
  // Mutation hooks
  useRegister,
  useLogin,
  useLogout,
  useUpdateProfile,
  useChangePassword,
  
  // Utilities
  authKeys,
  saveAuthData,
  getStoredAuthData,
  clearAuthData,
  setupAuthInterceptor,
  extractAuthErrorMessage,
  formatAuthValidationErrors,
};