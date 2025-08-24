/**
 * API configuration constants and settings
 * Purpose: Centralize API-related configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
} as const;
