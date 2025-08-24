/**
 * Authentication state selectors
 * Purpose: Provide memoized selectors for accessing auth state efficiently
 */
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store';
import type { UserProfile } from '../../types/auth';

// Basic selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectLastLoginTime = (state: RootState) => state.auth.lastLoginTime;

// Computed selectors
export const selectUserProfile = createSelector(
  [selectUser],
  (user): UserProfile | null => {
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      initials: user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      isVerified: !!user.email_verified_at,
      memberSince: new Date(user.created_at).toLocaleDateString(),
    };
  }
);

export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectIsLoading, selectAuthError],
  (isAuthenticated, isLoading, error) => ({
    isAuthenticated,
    isLoading,
    hasError: !!error,
    error,
    status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated',
  })
);

export const selectCanRefreshToken = createSelector(
  [selectRefreshToken, selectIsAuthenticated],
  (refreshToken, isAuthenticated) => {
    return !!refreshToken && !isAuthenticated;
  }
);
