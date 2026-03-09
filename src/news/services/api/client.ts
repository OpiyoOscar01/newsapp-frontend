import { type ApiResponse } from '../../types/news';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.definepress.com/api/v1';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '32|xdA0g01BTxjiMudCrlYbOyUiqcPYaa0ucdZN0viR1cfc148c';

export class ApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(
    message: string,
    status?: number,
    data?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private headers: HeadersInit;
  private retryAttempts = 3;
  private retryDelay = 1000;
  private requestQueue: Map<string, Promise<any>> = new Map();

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    this.initializeAuth();
  }

  private initializeAuth() {
    const token = this.getToken();
    if (token) {
      this.headers = {
        ...this.headers,
        'Authorization': `Bearer ${token}`,
      };
    } else if (API_TOKEN) {
      this.headers = {
        ...this.headers,
        'Authorization': `Bearer ${API_TOKEN}`,
      };
    }
  }

  // Enhanced Token Management
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_time', Date.now().toString());
    this.initializeAuth();
  }

  public removeToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_time');
    localStorage.removeItem('user_data');
    this.initializeAuth();
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    const authTime = localStorage.getItem('auth_time');
    
    if (!token) return false;
    
    // Check if token is older than 24 hours
    if (authTime) {
      const tokenAge = Date.now() - parseInt(authTime);
      if (tokenAge > 24 * 60 * 60 * 1000) {
        this.removeToken();
        return false;
      }
    }
    
    return true;
  }

  public getUserData(): any {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  public setUserData(userData: any): void {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  // Public API methods (no authentication required)
  async getPublic<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const requestKey = this.getRequestKey('GET', url);
    
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey)!;
    }

    // Remove auth headers for public requests
    const publicHeaders = { ...this.headers };
    delete (publicHeaders as any)['Authorization'];

    const promise = this.fetchWithRetry<T>(url, { 
      method: 'GET',
      headers: publicHeaders 
    });
    this.requestQueue.set(requestKey, promise);
    
    try {
      return await promise;
    } finally {
      this.requestQueue.delete(requestKey);
    }
  }

  async postPublic<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Remove auth headers for public requests
    const publicHeaders = { ...this.headers };
    delete (publicHeaders as any)['Authorization'];

    const response = await this.fetchWithRetry<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: publicHeaders,
    });

    this.handleAuthResponse(endpoint, response as any);
    return response;
  }

  // Protected API methods (with authentication)
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const requestKey = this.getRequestKey('GET', url);
    
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey)!;
    }

    const promise = this.fetchWithRetry<T>(url, { method: 'GET' });
    this.requestQueue.set(requestKey, promise);
    
    try {
      return await promise;
    } finally {
      this.requestQueue.delete(requestKey);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const response = await this.fetchWithRetry<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });

    this.handleAuthResponse(endpoint, response as any);
    return response;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    return this.fetchWithRetry<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    return this.fetchWithRetry<T>(url, { method: 'DELETE' });
  }

  // File upload support
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...this.headers } as Record<string, string>;
    delete headers['Content-Type']; // Let browser set content-type for FormData
    
    return this.fetchWithRetry<T>(url, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<T> {
    try {
      return await this.fetch<T>(url, options);
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.retryDelay * attempt);
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }
      throw error;
    }
  }

  private async fetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    // Add request timing
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      const contentType = response.headers.get('content-type');
      const isJson = !!contentType?.includes('application/json');

      if (!response.ok) {
        await this.handleErrorResponse(response, isJson);
      }

      if (!isJson) {
        throw new ApiError('Invalid response format: Expected JSON');
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new ApiError(data.message || 'API request failed');
      }

      // Log successful request
      this.logRequest('success', url, Date.now() - startTime);
      
      return data.data;
    } catch (error) {
      this.logRequest('error', url, Date.now() - startTime, error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error: Unable to connect to server');
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  private async handleErrorResponse(response: Response, isJson: boolean) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    let errorData = null;

    if (isJson) {
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore JSON parse error
      }
    }

    // Handle specific status codes
    if (response.status === 401) {
      this.removeToken();
      if (!window.location.pathname.includes('/auth/')) {
        window.dispatchEvent(new CustomEvent('auth-required'));
      }
    } else if (response.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (response.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  private handleAuthResponse(endpoint: string, response: any) {
    if (endpoint === '/auth/login' || endpoint === '/auth/register') {
      const token = response.token || response.data?.token || response.access_token;
      const userData = response.user || response.data?.user;
      
      if (token) {
        this.setToken(token);
      }
      if (userData) {
        this.setUserData(userData);
      }
    }

    if (endpoint === '/auth/logout') {
      this.removeToken();
    }
  }

  private logRequest(status: 'success' | 'error', url: string, duration: number, error?: any) {
    // Use Vite's import.meta.env.DEV in the browser environment instead of process.env
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV) {
      console.log(`🚀 API ${status.toUpperCase()}: ${url} (${duration}ms)`, error || '');
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => {
              url.searchParams.append(`${key}[]`, item.toString());
            });
          } else if (typeof value === 'object') {
            url.searchParams.append(key, JSON.stringify(value));
          } else {
            url.searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return url.toString();
  }

  private getRequestKey(method: string, url: string, data?: any): string {
    return `${method}:${url}:${JSON.stringify(data || {})}`;
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof ApiError) {
      return !error.status as any || error.status as any >= 500;
    }
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();