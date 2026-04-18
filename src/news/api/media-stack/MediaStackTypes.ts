// src/types/MediaStackTypes.ts

export const MediaStackCategories = {
  GENERAL: 'general',
  BUSINESS: 'business',
  ENTERTAINMENT: 'entertainment',
  HEALTH: 'health',
  SCIENCE: 'science',
  SPORTS: 'sports',
  TECHNOLOGY: 'technology',
} as const;

export type MediaStackCategory = typeof MediaStackCategories[keyof typeof MediaStackCategories];

export const NEWS_CATEGORIES: readonly MediaStackCategory[] = [
  'general', 'business', 'entertainment',
  'health', 'science', 'sports', 'technology'
] as const;

export type FetchType = 'latest' | 'category';

// API Response Types
export interface MediaStackStatusResponse {
  active: boolean;
}

export interface MediaStackUsageStatsResponse {
  remaining_requests: number;
  month: string;
  request_count: number;
  plan: string;
}

export interface MediaStackTestConnectionResponse {
  message: string;
}

export interface MediaStackFetchResponse {
  message: string;
  articles_fetched: number;
  articles_saved: number;
  data: unknown;
}

export interface SyncArticlesResponse {
  message: string;
  data?: unknown;
}

// UI State Types
export interface FetchResult {
  success: boolean;
  message: string;
  data?: unknown;
  articlesFetched?: number;
  articlesSaved?: number;
}

export interface ApiStatus {
  isActive: boolean;
  remainingRequests?: number;
  usageStats?: MediaStackUsageStatsResponse | null;
}

export interface MediaStackApiStatus {
  active: boolean;
  remaining_requests?: number;
  usage_stats?: MediaStackUsageStatsResponse | null;
}

// Normalized Types for UI
export interface MediaStackStatus {
  isActive: boolean;
  remainingRequests?: number;
  usageStats?: MediaStackUsageStatsResponse | null;
}

// Helper functions
export const createEmptyApiStatus = (): MediaStackStatus => ({
  isActive: false,
  remainingRequests: undefined,
  usageStats: null,
});

export const normalizeMediaStackStatus = (
  statusData: MediaStackStatusResponse,
  usageStats?: MediaStackUsageStatsResponse | null
): MediaStackStatus => ({
  isActive: statusData.active,
  remainingRequests: usageStats?.remaining_requests,
  usageStats: usageStats || null,
});

export const createEmptyFetchResult = (): FetchResult => ({
  success: false,
  message: '',
  data: null,
  articlesFetched: undefined,
  articlesSaved: undefined,
});

export const formatMediaStackError = (
  error: unknown,
  fallbackMessage = 'An error occurred with MediaStack operation.'
): string => {
  if (typeof error === 'string') return error;

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  }

  return fallbackMessage;
};

export default {
  MediaStackCategories,
  NEWS_CATEGORIES,
  createEmptyApiStatus,
  normalizeMediaStackStatus,
  createEmptyFetchResult,
  formatMediaStackError,
};