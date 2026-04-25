/**
 * PasswordResetTypes.ts
 * ============================================================================
 * PASSWORD RESET TYPE DEFINITIONS
 * ============================================================================
 * 
 * This file contains all TypeScript type declarations for password reset
 * operations including send reset link, verify token, and reset password.
 * 
 * @module passwordResetTypes
 */

/* -------------------------------------------------------------------------- */
/*                         REQUEST/RESPONSE TYPES                             */
/* -------------------------------------------------------------------------- */

/**
 * Send password reset link request payload
 */
export interface SendResetLinkRequest {
  email: string;
}

/**
 * Send reset link validation errors
 */
export interface SendResetLinkValidationErrors extends Record<string, string[]> {
  email: string[];
}

/**
 * Send reset link response
 */
export interface SendResetLinkResponse {
  success: boolean;
  message: string;
  errors?: SendResetLinkValidationErrors;
}

/**
 * Verify token request payload
 */
export interface VerifyTokenRequest {
  token: string;
  email: string;
}

/**
 * Verify token response data
 */
export interface VerifyTokenResponseData {
  email: string;
  token: string;
}

/**
 * Verify token validation errors
 */
export interface VerifyTokenValidationErrors extends Record<string, string[]> {
  token: string[];
  email: string[];
}

/**
 * Verify token response
 */
export interface VerifyTokenResponse {
  success: boolean;
  message: string;
  data?: VerifyTokenResponseData;
  errors?: VerifyTokenValidationErrors;
}

/**
 * Reset password request payload
 */
export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Reset password validation errors
 */
export interface ResetPasswordValidationErrors extends Record<string, string[]> {
  token: string[];
  email: string[];
  password: string[];
  password_confirmation: string[];
}

/**
 * Reset password response
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  errors?: ResetPasswordValidationErrors;
}

/* -------------------------------------------------------------------------- */
/*                           URL PARAMETERS TYPES                             */
/* -------------------------------------------------------------------------- */

/**
 * URL query parameters for password reset confirmation page
 */
export interface PasswordResetQueryParams {
  token: string;
  email: string;
}

/* -------------------------------------------------------------------------- */
/*                           UTILITY FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * Type guard to check if response is error response
 */
export function isPasswordResetErrorResponse(
  response: unknown
): response is SendResetLinkResponse | VerifyTokenResponse | ResetPasswordResponse {
  return (response as SendResetLinkResponse)?.success === false;
}

/**
 * Extract error message from password reset error
 */
export const extractPasswordResetErrorMessage = (
  error: any,
  fallbackMessage = 'An error occurred during password reset.'
): string => {
  return error.response?.data?.message || error.message || fallbackMessage;
};

/**
 * Format validation errors for display
 */
export const formatPasswordResetValidationErrors = (
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
/*                           EXPORT ALL TYPES                                 */
/* -------------------------------------------------------------------------- */

export default {
  isPasswordResetErrorResponse,
  extractPasswordResetErrorMessage,
  formatPasswordResetValidationErrors,
};