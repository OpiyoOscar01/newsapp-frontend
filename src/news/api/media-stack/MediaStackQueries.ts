// src/api/mediastack/MediaStackQueries.ts

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from '../axiosConfig';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../../../features/authentication/store/slices/authSlice';
import type {
  MediaStackStatus,
  MediaStackStatusResponse,
  MediaStackUsageStatsResponse,
  MediaStackTestConnectionResponse,
  MediaStackFetchResponse,
  SyncArticlesResponse,
  MediaStackCategory,
  FetchType,
} from  './MediaStackTypes';
import {
  createEmptyApiStatus,
  normalizeMediaStackStatus,
} from './MediaStackTypes';

/* -------------------------------------------------------------------------- */
/*                                 QUERY KEYS                                 */
/* -------------------------------------------------------------------------- */

export const mediaStackKeys = {
  all: ['mediastack'] as const,
  status: {
    all: () => [...mediaStackKeys.all, 'status'] as const,
    detail: () => [...mediaStackKeys.status.all(), 'detail'] as const,
  },
  usage: {
    all: () => [...mediaStackKeys.all, 'usage'] as const,
    stats: () => [...mediaStackKeys.usage.all(), 'stats'] as const,
  },
  fetch: {
    all: () => [...mediaStackKeys.all, 'fetch'] as const,
    latest: () => [...mediaStackKeys.fetch.all(), 'latest'] as const,
    category: (category: MediaStackCategory) => [...mediaStackKeys.fetch.all(), 'category', category] as const,
  },
  sync: {
    all: () => [...mediaStackKeys.all, 'sync'] as const,
    articles: () => [...mediaStackKeys.sync.all(), 'articles'] as const,
  },
};

/* -------------------------------------------------------------------------- */
/*                                 API LAYER                                  */
/* -------------------------------------------------------------------------- */

export async function getMediaStackStatusApi(): Promise<MediaStackStatus> {
  const [statusResponse, usageResponse] = await Promise.all([
    axiosInstance.get<MediaStackStatusResponse>('/mediastack/status'),
    axiosInstance.get<MediaStackUsageStatsResponse>('/mediastack/usage-stats').catch(() => ({ data: null })),
  ]);

  return normalizeMediaStackStatus(statusResponse.data, usageResponse.data);
}

export async function testMediaStackConnectionApi(): Promise<MediaStackTestConnectionResponse> {
  const response = await axiosInstance.post<MediaStackTestConnectionResponse>('/mediastack/test-connection');
  return response.data;
}

export async function fetchLatestNewsApi(): Promise<MediaStackFetchResponse> {
  const response = await axiosInstance.post<MediaStackFetchResponse>('/mediastack/fetch-latest', {});
  return response.data;
}

export async function fetchNewsByCategoryApi(category: MediaStackCategory): Promise<MediaStackFetchResponse> {
  const response = await axiosInstance.post<MediaStackFetchResponse>(
    `/mediastack/fetch-category/${category}`,
    {}
  );
  return response.data;
}

export async function syncMediaStackToArticlesApi(): Promise<SyncArticlesResponse> {
  const response = await axiosInstance.post<SyncArticlesResponse>('/admin/articles/sync-mediastack');
  return response.data;
}

/* -------------------------------------------------------------------------- */
/*                                   HOOKS                                    */
/* -------------------------------------------------------------------------- */

/**
 * Hook to check if user has admin privileges
 */
export const useIsAdmin = (): boolean => {
  const user = useSelector(selectUser);
  return user?.roles?.includes('admin') || user?.is_admin === true;
};

/**
 * Hook to get MediaStack API status
 * Only fetches if user is authenticated and has admin privileges
 */
export const useMediaStackStatus = (
  options?: Omit<
    UseQueryOptions<MediaStackStatus, AxiosError>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useIsAdmin();
  const isEnabled = isAuthenticated && isAdmin;

  return useQuery<MediaStackStatus, AxiosError>({
    queryKey: mediaStackKeys.status.detail(),
    queryFn: getMediaStackStatusApi,
    enabled: isEnabled,
    staleTime: 30000, // 30 seconds
    gcTime: 60000, // 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: 60000, // Auto-refresh every minute
    placeholderData: createEmptyApiStatus(),
    ...options,
  });
};

/**
 * Hook to test MediaStack connection
 * Public endpoint, doesn't require authentication
 */
export const useTestMediaStackConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testMediaStackConnectionApi,
    onSuccess: () => {
      // Invalidate status to refresh after successful test
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: mediaStackKeys.status.detail() });
      }, 1000);
    },
  });
};

/**
 * Hook to fetch latest news
 * Requires authentication and admin privileges
 */
export const useFetchLatestNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchLatestNewsApi,
    onSuccess: () => {
      // Invalidate status to update remaining requests
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: mediaStackKeys.status.detail() });
      }, 1000);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      if (error.response?.status === 403) {
        throw new Error('Admin privileges required to fetch news.');
      }
    },
  });
};

/**
 * Hook to fetch news by category
 * Requires authentication and admin privileges
 */
export const useFetchNewsByCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ category }: { category: MediaStackCategory }) => fetchNewsByCategoryApi(category),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: mediaStackKeys.status.detail() });
      }, 1000);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      if (error.response?.status === 403) {
        throw new Error('Admin privileges required to fetch news.');
      }
    },
  });
};

/**
 * Hook to sync MediaStack articles to public articles
 * Requires authentication and admin privileges
 */
export const useSyncMediaStackArticles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncMediaStackToArticlesApi,
    onSuccess: () => {
      // Invalidate related queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: mediaStackKeys.status.detail() });
        queryClient.invalidateQueries({ queryKey: ['articles'] });
      }, 1000);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      if (error.response?.status === 403) {
        throw new Error('Admin privileges required to sync articles.');
      }
    },
  });
};

/**
 * Combined hook for fetching news (handles both latest and category)
 */
export const useFetchNews = () => {
  const fetchLatest = useFetchLatestNews();
  const fetchByCategory = useFetchNewsByCategory();

  const fetchNews = async (type: FetchType, category?: MediaStackCategory) => {
    if (type === 'latest') {
      return fetchLatest.mutateAsync();
    }
    if (type === 'category' && category) {
      return fetchByCategory.mutateAsync({ category });
    }
    throw new Error('Invalid fetch type or missing category');
  };

  return {
    fetchNews,
    isLoading: fetchLatest.isPending || fetchByCategory.isPending,
    error: fetchLatest.error || fetchByCategory.error,
    reset: () => {
      fetchLatest.reset();
      fetchByCategory.reset();
    },
  };
};

/* -------------------------------------------------------------------------- */
/*                                 EXPORT ALL                                 */
/* -------------------------------------------------------------------------- */

export default {
  mediaStackKeys,
  useMediaStackStatus,
  useTestMediaStackConnection,
  useFetchLatestNews,
  useFetchNewsByCategory,
  useSyncMediaStackArticles,
  useFetchNews,
  useIsAdmin,
  getMediaStackStatusApi,
  testMediaStackConnectionApi,
  fetchLatestNewsApi,
  fetchNewsByCategoryApi,
  syncMediaStackToArticlesApi,
};