/**
 * AuthTypes.ts
 * ============================================================================
 * AUTHENTICATION TYPE DEFINITIONS
 * ============================================================================
 * 
 * This file contains all TypeScript type declarations for authentication
 * operations including register, login, logout, profile management,
 * and password change functionality.
 * 
 * @module authTypes
 * @description Comprehensive type definitions for user authentication,
 * authorization, and profile management with role-based access control.
 */

/* -------------------------------------------------------------------------- */
/*                              CORE USER TYPES                               */
/* -------------------------------------------------------------------------- */

/**
 * User role types from Spatie Permission
 */
export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
  SYSTEM: 'system',
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

/**
 * Raw user entity from API backend
 */
export interface ApiUser {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  email_verified_at?: string | null;
  is_admin?: boolean;
  roles?: string[];
  created_at: string;
  updated_at?: string;
}

/**
 * Frontend-formatted user with computed properties
 */
export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isAdmin: boolean;
  roles: UserRole[];
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                         REQUEST/RESPONSE TYPES                             */
/* -------------------------------------------------------------------------- */

/**
 * Register request payload
 */
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Register validation errors
 */
export interface RegisterValidationErrors {
  first_name?: string[];
  last_name?: string[];
  name?: string[];
  email?: string[];
  password?: string[];
password_confirmation?: string[]; // Add this line

}

/**
 * Register response data
 */
export interface RegisterResponseData {
  user: ApiUser;
  access_token: string;
  token_type: 'Bearer';
}

/**
 * Register API response
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterResponseData;
  errors?: RegisterValidationErrors;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login validation errors
 */
export interface LoginValidationErrors {
  email?: string[];
  password?: string[];
}

/**
 * Login response data
 */
export interface LoginResponseData {
  user: ApiUser;
  access_token: string;
  token_type: 'Bearer';
}

/**
 * Login API response
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
  errors?: LoginValidationErrors;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Profile response data
 */
export interface ProfileResponseData {
  user: ApiUser;
}

/**
 * Profile API response
 */
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileResponseData;
}

/**
 * Update profile request payload
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

/**
 * Update profile validation errors
 */
export interface UpdateProfileValidationErrors {
  name?: string[];
  email?: string[];
}

/**
 * Update profile response data
 */
export interface UpdateProfileResponseData {
  user: ApiUser;
}

/**
 * Update profile API response
 */
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UpdateProfileResponseData;
  errors?: UpdateProfileValidationErrors;
}

/**
 * Change password request payload
 */
export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * Change password validation errors
 */
export interface ChangePasswordValidationErrors {
  current_password?: string[];
  password?: string[];
}

/**
 * Change password response
 */
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  errors?: ChangePasswordValidationErrors;
}

/* -------------------------------------------------------------------------- */
/*                              STORAGE TYPES                                 */
/* -------------------------------------------------------------------------- */

/**
 * Stored auth data in localStorage/sessionStorage
 */
export interface StoredAuthData {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

/**
 * Auth context state
 */
export interface AuthState {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

/* -------------------------------------------------------------------------- */
/*                              UTILITY TYPES                                 */
/* -------------------------------------------------------------------------- */

/**
 * Type guard to check if response is error response
 */
export function isAuthErrorResponse(
  response: unknown
): response is RegisterResponse | LoginResponse {
  return (response as RegisterResponse)?.success === false;
}

/**
 * Helper to extract user role from API user
 */
export function extractUserRoles(apiUser: ApiUser): UserRole[] {
  if (apiUser.roles && apiUser.roles.length > 0) {
    return apiUser.roles as UserRole[];
  }
  return apiUser.is_admin ? [UserRoles.ADMIN] : [UserRoles.USER];
}

/**
 * Convert API user to frontend user model
 */
export function toUserModel(apiUser: ApiUser): User {
  return {
    id: apiUser.id.toString(),
    name: apiUser.name,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    email: apiUser.email,
    isAdmin: apiUser.is_admin || apiUser.roles?.includes('admin') || false,
    roles: extractUserRoles(apiUser),
    emailVerifiedAt: apiUser.email_verified_at ? new Date(apiUser.email_verified_at) : undefined,
    createdAt: new Date(apiUser.created_at),
    updatedAt: apiUser.updated_at ? new Date(apiUser.updated_at) : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/*                           EXPORT ALL TYPES                                 */
/* -------------------------------------------------------------------------- */

export default {
  UserRoles,
  isAuthErrorResponse,
  extractUserRoles,
  toUserModel,
};