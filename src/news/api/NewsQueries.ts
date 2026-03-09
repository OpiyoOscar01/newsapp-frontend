/**
 * ============================================================================
 * NEWS & ARTICLES REACT QUERY HOOKS
 * ============================================================================
 * 
 * This file contains all React Query mutation and query hooks for news and article
 * management operations. Handles API communication, error handling, and
 * toast notifications.
 * 
 * @module useNewsQueries
 * @description Provides type-safe, reusable hooks for all article and category
 * operations. Component redirects are handled externally.
 * 
 * @requires @tanstack/react-query
 * @requires axios
 */

import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from './axiosConfig'; 
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ArticleFilters,
  RecordViewResponse,
  RecordViewParams,
  CategorySlug,
  ArticleId,
  MutationCallbacks,
  ApiCategory,
  ApiArticle,
} from './NewsTypes';

/* -------------------------------------------------------------------------- */
/*                               QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

/**
 * Centralized query keys for React Query caching and invalidation.
 * Hierarchical structure enables precise cache management.
 * 
 * @example
 * // Invalidate all article queries
 * queryClient.invalidateQueries({ queryKey: newsKeys.articles.all });
 * 
 * // Invalidate specific article
 * queryClient.invalidateQueries({ queryKey: newsKeys.articles.detail(id) });
 */
export const newsKeys = {
  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...newsKeys.categories.all, 'list'] as const,
    list: () => [...newsKeys.categories.lists()] as const,
    details: () => [...newsKeys.categories.all, 'detail'] as const,
    detail: (slug: CategorySlug) => [...newsKeys.categories.details(), slug] as const,
  },
  
  // Articles
  articles: {
    all: ['articles'] as const,
    lists: () => [...newsKeys.articles.all, 'list'] as const,
    list: (filters: ArticleFilters) => [...newsKeys.articles.lists(), filters] as const,
    details: () => [...newsKeys.articles.all, 'detail'] as const,
    detail: (id: ArticleId) => [...newsKeys.articles.details(), id] as const,
    related: (id: ArticleId) => [...newsKeys.articles.all, 'related', id] as const,
  },
  
  // News endpoints
  news: {
    all: ['news'] as const,
    latest: (limit?: number) => [...newsKeys.news.all, 'latest', limit] as const,
    trending: (limit?: number) => [...newsKeys.news.all, 'trending', limit] as const,
    featured: () => [...newsKeys.news.all, 'featured'] as const,
    byCategory: (category: string, limit?: number) => 
      [...newsKeys.news.all, 'by-category', category, limit] as const,
    bySource: (source: string, limit?: number) => 
      [...newsKeys.news.all, 'by-source', source, limit] as const,
    search: (query: string, limit?: number) => 
      [...newsKeys.news.all, 'search', query, limit] as const,
    categorized: (categories?: string[], limit?: number) => 
      [...newsKeys.news.all, 'categorized', categories, limit] as const,
  },
};

/* -------------------------------------------------------------------------- */
/*                         CATEGORY QUERY HOOKS                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all categories from the system.
 * 
 * @param options - React Query options for customizing behavior
 * @returns Query result with categories list
 * 
 * @example
 * const { data, isLoading, error } = useGetCategories();
 */
export const useGetCategories = (
  options?: Omit<UseQueryOptions<ApiCategory[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiCategory[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.categories.list(),
    queryFn: async () => {
      const response = await axiosInstance.get('/categories');
      // Handle both wrapped response (response.data.data) and direct array response (response.data)
      const responseData = response.data as ApiSuccessResponse<ApiCategory[]> | ApiCategory[];
      const rawData = (responseData as ApiSuccessResponse<ApiCategory[]>)?.data ?? responseData;
      console.log("Category Data:");
      console.log(rawData);
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Fetches a single category by slug.
 * 
 * @param slug - Category slug to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with category details
 * 
 * @example
 * const { data, isLoading } = useGetCategory('technology');
 */
export const useGetCategory = (
  slug: CategorySlug,
  options?: Omit<UseQueryOptions<ApiCategory, AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiCategory, AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.categories.detail(slug),
    queryFn: async () => {
      const response = await axiosInstance.get(`/categories/${slug}`);
      const responseData = response.data as ApiSuccessResponse<ApiCategory> | ApiCategory;
      return (responseData as ApiSuccessResponse<ApiCategory>)?.data ?? responseData;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/* -------------------------------------------------------------------------- */
/*                         ARTICLE QUERY HOOKS                                */
/* -------------------------------------------------------------------------- */

/**
 * Fetches articles with optional filtering and pagination.
 * 
 * @param filters - Query parameters for filtering
 * @param options - React Query options for customizing behavior
 * @returns Query result with articles list
 * 
 * @example
 * const { data, isLoading } = useGetArticles({
 *   category: 'technology',
 *   perPage: 20
 * });
 */
export const useGetArticles = (
  filters: ArticleFilters = {},
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.articles.list(filters),
    queryFn: async () => {
      const response = await axiosInstance.get('/articles', {
        params: filters,
      });
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Fetches a single article by ID.
 * 
 * @param id - Article ID to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with article details
 * 
 * @example
 * const { data, isLoading } = useGetArticle('123');
 */
export const useGetArticle = (
  id: ArticleId,
  options?: Omit<UseQueryOptions<ApiArticle, AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle, AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.articles.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(`/articles/${id}`);
      const responseData = response.data as ApiSuccessResponse<ApiArticle> | ApiArticle;
      return (responseData as ApiSuccessResponse<ApiArticle>)?.data ?? responseData;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

/**
 * Fetches related articles for a given article.
 * 
 * @param id - Article ID to find related articles for
 * @param options - React Query options for customizing behavior
 * @returns Query result with related articles
 * 
 * @example
 * const { data } = useGetRelatedArticles('123');
 */
export const useGetRelatedArticles = (
  id: ArticleId,
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.articles.related(id),
    queryFn: async () => {
      const response = await axiosInstance.get(`/articles/${id}/related`);
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 3, // 3 minutes
    ...options,
  });
};

/* -------------------------------------------------------------------------- */
/*                          NEWS QUERY HOOKS                                  */
/* -------------------------------------------------------------------------- */

/**
 * Fetches latest articles.
 * 
 * @param limit - Number of articles to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with latest articles
 * 
 * @example
 * const { data } = useGetLatestArticles(10);
 */
export const useGetLatestArticles = (
  limit?: number,
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.news.latest(limit),
    queryFn: async () => {
      const response = await axiosInstance.get('/news/latest', {
        params: { limit },
      });
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
};

/**
 * Fetches trending articles.
 * 
 * @param limit - Number of articles to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with trending articles
 * 
 * @example
 * const { data } = useGetTrendingArticles(5);
 */
export const useGetTrendingArticles = (
  limit?: number,
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.news.trending(limit),
    queryFn: async () => {
      const response = await axiosInstance.get('/news/trending', {
        params: { limit },
      });
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Fetches featured articles.
 * 
 * @param options - React Query options for customizing behavior
 * @returns Query result with featured articles
 * 
 * @example
 * const { data } = useGetFeaturedArticles();
 */
export const useGetFeaturedArticles = (
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.news.featured(),
    queryFn: async () => {
      const response = await axiosInstance.get('/news/featured');
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      console.log("Feature Articles.");
      console.log(rawData);
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
    ...options,
  });
};

/**
 * Fetches articles by category.
 * 
 * @param category - Category slug to filter by
 * @param limit - Number of articles to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with category articles
 * 
 * @example
 * const { data } = useGetArticlesByCategory('technology', 20);
 */
export const useGetArticlesByCategory = (
  category: string,
  limit?: number,
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.news.byCategory(category, limit),
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/news/by-category/${category}`,
        { params: { limit } }
      );
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      console.log("Articles by category");
      console.log(rawData);
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Fetches articles by source.
 * 
 * @param source - Source name to filter by
 * @param limit - Number of articles to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with source articles
 * 
 * @example
 * const { data } = useGetArticlesBySource('reuters', 10);
 */
export const useGetArticlesBySource = (
  source: string,
  limit?: number,
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.news.bySource(source, limit),
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/news/by-source/${source}`,
        { params: { limit } }
      );
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!source,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Searches articles by query string.
 * 
 * @param query - Search query
 * @param limit - Number of results to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with search results
 * 
 * @example
 * const { data } = useSearchArticles('artificial intelligence', 20);
 */
export const useSearchArticles = (
  query: string,
  limit?: number,
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.news.search(query, limit),
    queryFn: async () => {
      const response = await axiosInstance.get('/news/search', {
        params: { q: query, limit },
      });
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      return Array.isArray(rawData) ? rawData : [];
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
};

/**
 * Fetches categorized articles.
 * 
 * @param categories - Array of category slugs
 * @param limit - Number of articles to fetch
 * @param options - React Query options for customizing behavior
 * @returns Query result with categorized articles
 * 
 * @example
 * const { data } = useGetCategorizedArticles(['tech', 'business'], 30);
 */
export const useGetCategorizedArticles = (
  categories?: string[],
  limit?: number,
  options?: Omit<UseQueryOptions<ApiArticle[], AxiosError<ApiErrorResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiArticle[], AxiosError<ApiErrorResponse>>({
    queryKey: newsKeys.news.categorized(categories, limit),
    queryFn: async () => {
      const response = await axiosInstance.get('/news/categorized', {
        params: { 
          categories: categories?.join(','), 
          limit 
        },
      });
      const responseData = response.data as ApiSuccessResponse<ApiArticle[]> | ApiArticle[];
      const rawData = (responseData as ApiSuccessResponse<ApiArticle[]>)?.data ?? responseData;
      return Array.isArray(rawData) ? rawData : [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/* -------------------------------------------------------------------------- */
/*                             MUTATION HOOKS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Records a view for an article (increments view count).
 * 
 * @param callbacks - Optional onSuccess and onError callbacks
 * @returns Mutation object with mutate function and state
 * 
 * @example
 * const { mutate } = useRecordArticleView({
 *   onSuccess: (data) => console.log('View recorded', data),
 * });
 * 
 * mutate({ id: '123' });
 */
export const useRecordArticleView = (
  callbacks: MutationCallbacks<RecordViewResponse, AxiosError<ApiErrorResponse>> = {}
) => {
  return useMutation<RecordViewResponse, AxiosError<ApiErrorResponse>, RecordViewParams>({
    mutationFn: async ({ id }: RecordViewParams) => {
      const response = await axiosInstance.post(`/articles/${id}/view`);
      const responseData = response.data as ApiSuccessResponse<RecordViewResponse> | RecordViewResponse;
      return (responseData as ApiSuccessResponse<RecordViewResponse>)?.data ?? responseData;
    },
    onSuccess: (data) => {
      callbacks.onSuccess?.(data);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('Failed to record article view:', error.response?.data?.message || error.message);
      callbacks.onError?.(error);
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           UTILITY FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * Helper function to extract error message from Axios error.
 * 
 * @param error - Axios error from failed request
 * @param fallbackMessage - Default message if API message unavailable
 * @returns Human-readable error message
 * 
 * @internal
 */
export const extractErrorMessage = (
  error: AxiosError<ApiErrorResponse>,
  fallbackMessage = 'An unexpected error occurred.'
): string => {
  return error.response?.data?.message || error.message || fallbackMessage;
};

/**
 * Helper function to format validation errors into readable string.
 * 
 * @param errors - Validation errors object from API
 * @returns Formatted error string or empty string if no errors
 * 
 * @internal
 */
export const formatValidationErrors = (errors?: Record<string, string[]>): string => {
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
/*                            EXPORT ALL HOOKS                                */
/* -------------------------------------------------------------------------- */

export default {
  // Query hooks - Categories
  useGetCategories,
  useGetCategory,

  // Query hooks - Articles
  useGetArticles,
  useGetArticle,
  useGetRelatedArticles,

  // Query hooks - News
  useGetLatestArticles,
  useGetTrendingArticles,
  useGetFeaturedArticles,
  useGetArticlesByCategory,
  useGetArticlesBySource,
  useSearchArticles,
  useGetCategorizedArticles,

  // Mutation hooks
  useRecordArticleView,

  // Utilities
  newsKeys,
  extractErrorMessage,
  formatValidationErrors,
};