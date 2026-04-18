// src/renderer/app/api/axiosConfig.ts

import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

// Storage key constant (must match the one in AuthQueries)
const AUTH_STORAGE_KEY = 'auth_data';

// Store reference for accessing token
let storeRef: any = null;
let currentToken: string | null = null;

/**
 * Get token directly from localStorage
 */
const getTokenFromLocalStorage = (): string | null => {
  try {
    const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      return parsed.access_token || null;
    }
  } catch (error) {
    console.error('Failed to read token from localStorage:', error);
  }
  return null;
};

/**
 * Set the Redux store reference for axios interceptors
 * Call this in your app entry point after creating the store
 */
export const setAxiosStore = (store: any) => {
  storeRef = store;
  
  // Initialize token from store or localStorage
  let initialToken: string | null = null;
  
  if (store) {
    const state = store.getState();
    initialToken = state.auth?.accessToken || null;
  }
  
  // If no token in store, try localStorage
  if (!initialToken) {
    initialToken = getTokenFromLocalStorage();
  }
  
  currentToken = initialToken;
  
  // Set default header if token exists
  if (currentToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
  }
  
  // Subscribe to store changes to keep token in sync
  if (store) {
    store.subscribe(() => {
      const newState = store.getState();
      let newToken = newState.auth?.accessToken || null;
      
      // If no token in store, check localStorage
      if (!newToken) {
        newToken = getTokenFromLocalStorage();
      }
      
      if (newToken !== currentToken) {
        currentToken = newToken;
        // Update default header for all future requests
        if (currentToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        } else {
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      }
    });
  }
};

/**
 * Get the current access token from multiple sources
 * Priority: Redux store -> localStorage -> cached token
 */
const getAuthToken = (): string | null => {
  // Return cached token for performance if available
  if (currentToken) {
    return currentToken;
  }
  
  // Try to get from Redux store first
  if (storeRef) {
    try {
      const state = storeRef.getState();
      const token = state.auth?.accessToken || null;
      if (token) {
        currentToken = token;
        return token;
      }
    } catch (error) {
      console.error('Failed to get token from store:', error);
    }
  }
  
  // Fallback to localStorage
  const localStorageToken = getTokenFromLocalStorage();
  if (localStorageToken) {
    currentToken = localStorageToken;
    return localStorageToken;
  }
  
  return null;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization header
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Axios] Token attached to request:', config.url);
    } else {
      console.warn('[Axios] No token available for request:', config.url);
    }

    // Handle Content-Type
    const isFormData = config.data instanceof FormData;
    
    if (isFormData) {
      // Let browser set multipart/form-data with boundary
      delete config.headers['Content-Type'];
    } else {
      const method = (config.method || 'get').toLowerCase();
      const hasBody = ['post', 'put', 'patch', 'delete'].includes(method);
      
      if (hasBody && config.data !== undefined) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for 401 handling
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Dispatch logout on 401
        if (storeRef) {
          const { clearAuth } = await import('../../features/authentication/store/slices/authSlice');
          storeRef.dispatch(clearAuth());
        } else {
          // If no store reference, just clear localStorage
          localStorage.removeItem(AUTH_STORAGE_KEY);
          currentToken = null;
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
        
        processQueue(null);
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: { retry: 1 },
  },
});

export { axiosInstance };
export default axiosInstance;