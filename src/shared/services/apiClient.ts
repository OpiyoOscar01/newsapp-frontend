/**
 * Axios instance configuration with interceptors
 * Purpose: Configure HTTP client with authentication, error handling, and request/response transformation
 */
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../../config/api';
import type { ApiError } from '../types/api';
import  { store } from '../../store';
import { clearAuth } from '../../features/authentication/store/slices/authSlice';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        
        if (token && !config.headers.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (import.meta.env.NODE_ENV === 'development') {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle common errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful responses in development
        if (import.meta.env.NODE_ENV === 'development') {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }

        return response;
      },
      (error) => {
        const apiError = this.handleError(error);
        
        // Handle 401 Unauthorized - Clear auth state
        if (apiError.status === 401) {
          this.handleUnauthorized();
        }

        return Promise.reject(apiError);
      }
    );
  }

  private getAuthToken(): string | null {
    // Get token from Redux store first, fallback to localStorage
    const state = store.getState();
    return state.auth.token || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private handleUnauthorized(): void {
    // Clear Redux state
    store.dispatch(clearAuth());
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    // Redirect to login (you might want to use React Router for this)
    window.location.href = '/login';
  }

  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: 500,
    };

    if (error.response) {
      // Server responded with error status
      apiError.status = error.response.status;
      apiError.message = error.response.data?.message || error.message;
      apiError.errors = error.response.data?.errors;
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error. Please check your connection.';
      apiError.status = 0;
    } else {
      // Other error
      apiError.message = error.message;
    }

    // Log errors in development
    if (import.meta.env.NODE_ENV === 'development') {
      console.error('API Error:', apiError);
    }

    return apiError;
  }

  // Public methods for making requests
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }
}

export const apiClient = new ApiClient();