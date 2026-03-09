// src/renderer/app/api/axiosConfig.ts

import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { QueryClient } from '@tanstack/react-query'; 
import { API_BASE_URL, API_TIMEOUT } from './apiConfig';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: 'application/json',
    // IMPORTANT: do NOT set Content-Type globally
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    // ---------------- Authorization ----------------
    const token = "6|mFkymrw8ljxFBb6IYG3aCbxmspTkOfZDkz7wBYSnc9dbc411";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    // ---------------- Content-Type Strategy ----------------
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;

    if (isFormData) {
      // Let the browser set: multipart/form-data; boundary=....
      // Remove any forced JSON content-type if present.
      // Axios v1 headers can be AxiosHeaders, so support both delete styles.
      (config.headers as any)?.delete?.('Content-Type');
      delete (config.headers as any)['Content-Type'];
    } else {
      // For JSON requests, set application/json when there's a body.
      const method = (config.method || 'get').toLowerCase();
      const hasBody = ['post', 'put', 'patch', 'delete'].includes(method);

      if (hasBody && config.data !== undefined) {
        (config.headers as any)?.set?.('Content-Type', 'application/json');
        if (!(config.headers as any)?.set) {
          (config.headers as any)['Content-Type'] = 'application/json';
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Prevents multiple in-flight 401 responses (e.g. several parallel queries
 * all expiring at once) from each triggering a logout + toast + redirect.
 */
let _isHandling401 = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !_isHandling401) {
      _isHandling401 = true;

      // Reset flag after a short window so future logins work normally
      setTimeout(() => {
        _isHandling401 = false;
      }, 3000);
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
