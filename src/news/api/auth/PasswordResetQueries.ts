/**
 * PasswordResetQueries.ts
 * ============================================================================
 * PASSWORD RESET REACT QUERY HOOKS
 * ============================================================================
 * 
 * This file contains all React Query mutation hooks for password reset
 * operations including sending reset link, verifying token, and resetting password.
 * 
 * @module usePasswordResetQueries
 */

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from './../axiosConfig';
import type {
  SendResetLinkRequest,
  SendResetLinkResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './PasswordResetTypes';

/* -------------------------------------------------------------------------- */
/*                               QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const passwordResetKeys = {
  all: ['password-reset'] as const,
  sendLink: () => [...passwordResetKeys.all, 'send-link'] as const,
  verifyToken: () => [...passwordResetKeys.all, 'verify-token'] as const,
  reset: () => [...passwordResetKeys.all, 'reset'] as const,
};

/* -------------------------------------------------------------------------- */
/*                           PASSWORD RESET HOOKS                             */
/* -------------------------------------------------------------------------- */

/**
 * Send password reset link to user's email
 */
export const useSendResetLink = (
  callbacks?: {
    onSuccess?: (data: SendResetLinkResponse) => void;
    onError?: (error: AxiosError<SendResetLinkResponse>) => void;
  }
) => {
  return useMutation<SendResetLinkResponse, AxiosError<SendResetLinkResponse>, SendResetLinkRequest>({
    mutationFn: async (data: SendResetLinkRequest) => {
      const response = await axiosInstance.post<SendResetLinkResponse>('/password-reset/send-link', data);
      return response.data;
    },
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Send reset link failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Verify password reset token
 */
export const useVerifyToken = (
  callbacks?: {
    onSuccess?: (data: VerifyTokenResponse) => void;
    onError?: (error: AxiosError<VerifyTokenResponse>) => void;
  }
) => {
  return useMutation<VerifyTokenResponse, AxiosError<VerifyTokenResponse>, VerifyTokenRequest>({
    mutationFn: async (data: VerifyTokenRequest) => {
      const response = await axiosInstance.post<VerifyTokenResponse>('/password-reset/verify-token', data);
      return response.data;
    },
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Token verification failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/**
 * Reset password with token and new password
 */
export const useResetPassword = (
  callbacks?: {
    onSuccess?: (data: ResetPasswordResponse) => void;
    onError?: (error: AxiosError<ResetPasswordResponse>) => void;
  }
) => {
  return useMutation<ResetPasswordResponse, AxiosError<ResetPasswordResponse>, ResetPasswordRequest>({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await axiosInstance.post<ResetPasswordResponse>('/password-reset/reset', data);
      return response.data;
    },
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Password reset failed:', error.response?.data?.message || error.message);
      callbacks?.onError?.(error);
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           UTILITY FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * Extract validation errors from password reset error response
 */
export const extractPasswordResetErrors = (
  error: AxiosError<SendResetLinkResponse | VerifyTokenResponse | ResetPasswordResponse>
): Record<string, string[]> => {
  return (error.response?.data?.errors as Record<string, string[]>) || {};
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (
  error: AxiosError<SendResetLinkResponse | VerifyTokenResponse | ResetPasswordResponse>
): boolean => {
  return error.response?.status === 422 && !!error.response?.data?.errors;
};

/* -------------------------------------------------------------------------- */
/*                            EXPORT ALL HOOKS                                */
/* -------------------------------------------------------------------------- */

export default {
  useSendResetLink,
  useVerifyToken,
  useResetPassword,
  passwordResetKeys,
  extractPasswordResetErrors,
  isValidationError,
};