import { type ApiResponse } from '../../types/news';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '8|o0MM5b8VLbzndqREiW4VJHYG3ThxE554Z9F67q9q8ce7b00e';

export class ApiError extends Error {
  constructor(
    message: string,
     status?: number,
     data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private headers: HeadersInit;
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    return this.fetchWithRetry<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    return this.fetchWithRetry<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
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
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
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

        throw new ApiError(errorMessage, response.status, errorData);
      }

      if (!isJson) {
        throw new ApiError('Invalid response format: Expected JSON');
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new ApiError(data.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
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

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    
    return url.toString();
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof ApiError) {
      // Retry on network errors or 5xx server errors
      return !error.status || error.status >= 500;
    }
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();
