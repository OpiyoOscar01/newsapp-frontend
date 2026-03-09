/**
 * API Configuration & Endpoints
 * Centralized configuration for API calls, feature flags, and endpoints
 */

/* ======================================================
   Environment - Using Vite's built-in flags (recommended)
====================================================== */
const isDevelopment = import.meta.env.DEV;  // Vite's built-in DEV flag
const isProduction = import.meta.env.PROD;  // Vite's built-in PROD flag
const mode = import.meta.env.MODE;           // 'development' or 'production'

// Log environment info in development only
if (isDevelopment) {
  console.log('🔧 Environment:', { 
    mode, 
    isDevelopment, 
    isProduction,
    VITE_API_TOKEN: import.meta.env.VITE_API_TOKEN ? '✅ Set' : '❌ Missing'
  });
}

export const API_AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || '';

/* ======================================================
   Base URL & Timeout
====================================================== */

// Allow override via .env file, fallback to environment-specific defaults
export const API_BASE_URL = 
  isDevelopment
    ? 'http://127.0.0.1:8000/api/v1'  // local dev
    : 'https://api.definepress.com/api/v1'  // production
;

// Parse timeout with fallback
export const API_TIMEOUT = (() => {
  const timeout = import.meta.env.VITE_API_TIMEOUT || '30000';
  return parseInt(timeout, 10);
})();

/* ======================================================
   Feature Flags
====================================================== */
export const FEATURES = {
  ENABLE_ANALYTICS: !isDevelopment && import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  ENABLE_ERROR_LOGGING: isProduction || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true',
  ENABLE_PERFORMANCE_MONITORING: isProduction || import.meta.env.VITE_ENABLE_PERFORMANCE === 'true',
  ENABLE_DEBUG_MODE: isDevelopment || import.meta.env.VITE_DEBUG_MODE === 'true',
} as const;

/* ======================================================
   API Config
====================================================== */
export const API_CONFIG = {
  retryAttempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS || '3', 10),
  retryDelay: parseInt(import.meta.env.VITE_RETRY_DELAY || '1000', 10), // 1 second
  cacheDuration: {
    short: 1000 * 60 * 1,   // 1 minute
    medium: 1000 * 60 * 5,  // 5 minutes
    long: 1000 * 60 * 30,   // 30 minutes
  },
} as const;

/* ======================================================
   Rate Limiting
====================================================== */
export const RATE_LIMIT = {
  maxRequests: parseInt(import.meta.env.VITE_MAX_REQUESTS || '100', 10),
  windowMs: 1000 * 60, // 1 minute
} as const;

/* ======================================================
   API Endpoints (for reference)
====================================================== */
export const API_ENDPOINTS = {
  // Categories
  categories: '/categories',
  category: (slug: string) => `/categories/${slug}`,
  
  // Articles
  articles: '/articles',
  article: (id: string | number) => `/articles/${id}`,
  relatedArticles: (id: string | number) => `/articles/${id}/related`,
  recordView: (id: string | number) => `/articles/${id}/view`,
  
  // News
  latest: '/news/latest',
  trending: '/news/trending',
  featured: '/news/featured',
  byCategory: (category: string) => `/news/by-category/${category}`,
  bySource: (source: string) => `/news/by-source/${source}`,
  search: '/news/search',
  categorized: '/news/categorized',
} as const;

/* ======================================================
   Default Export
====================================================== */
export default {
  API_BASE_URL,
  API_TIMEOUT,
  FEATURES,
  API_CONFIG,
  RATE_LIMIT,
  API_ENDPOINTS,
};