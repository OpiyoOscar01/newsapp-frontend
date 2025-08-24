/**
 * Generic API-related types
 * Purpose: Define common API response patterns and error handling types
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
  code?: string;
}

export interface RequestConfig {
  skipAuth?: boolean;
  timeout?: number;
  retries?: number;
}
