/**
 * Authentication-related TypeScript interfaces and types
 * Purpose: Define the shape of user data, requests, and API responses
 */

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  token: string;
  refresh_token?: string;
  expires_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: string | null;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

// User-derived computed properties
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  initials: string;
  isVerified: boolean;
  memberSince: string;
}
