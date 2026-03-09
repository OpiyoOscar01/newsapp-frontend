/**
 * ============================================================================
 * NEWS & ARTICLES TYPE DEFINITIONS
 * ============================================================================
 * 
 * This file contains all TypeScript type declarations for news and article-related
 * operations in the DefinePress news platform.
 * 
 * @module newsTypes
 * @description Comprehensive type definitions for articles, categories, including
 * request/response types, enums, and utility types for type-safe API interactions.
 */

/* -------------------------------------------------------------------------- */
/*                                   ENUMS                                    */
/* -------------------------------------------------------------------------- */

/**
 * Article status types
 */
export const ArticleStatus = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const;

export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus];

/**
 * Category status
 */
export const CategoryStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type CategoryStatus = typeof CategoryStatus[keyof typeof CategoryStatus];

/* -------------------------------------------------------------------------- */
/*                              NESTED TYPES                                  */
/* -------------------------------------------------------------------------- */

/**
 * Category model reference in article responses
 */
export interface CategoryModel {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

/**
 * Metadata structure for articles
 */
export type ArticleMetadata = Record<string, unknown>;

/**
 * Operating hours or structured JSON data
 */
export type StructuredData = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/*                            CORE API TYPES                                  */
/* -------------------------------------------------------------------------- */

/**
 * Raw category entity from API backend
 */
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

/**
 * Raw article entity from API backend
 */
export interface ApiArticle {
  id: number;
  title: string;
  content?: string | null;
  description?: string | null;
  meta_description?: string | null;
  excerpt?: string | null;
  summary?: string | null;
  author?: string | null;
  published_at: string;
  image_url?: string | null;
  category: string;
  category_model?: CategoryModel;
  tags?: string | string[] | null;
  url?: string | null;
  source?: string | null;
  view_count?: number;
  is_featured?: boolean;
  status?: ArticleStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

/**
 * Frontend-formatted category with computed properties
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount?: number;
  isActive: boolean;
}

/**
 * Frontend-formatted article with computed properties
 */
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  readTime: number;
  tags: string[];
  url?: string;
  source?: string;
  viewCount?: number;
  isFeatured?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          REQUEST/RESPONSE TYPES                            */
/* -------------------------------------------------------------------------- */

/**
 * Query parameters for filtering article list
 */
export interface ArticleFilters {
  category?: string;
  status?: ArticleStatus;
  search?: string;
  tags?: string[];
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
  limit?: number;
  show_deleted?: boolean;
}

/**
 * Query parameters for news endpoints
 */
export interface NewsFilters {
  limit?: number;
  category?: string;
  categories?: string[];
  source?: string;
  q?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

/**
 * Standard API success response structure
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
}

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

/* -------------------------------------------------------------------------- */
/*                            API RESPONSE TYPES                              */
/* -------------------------------------------------------------------------- */

/**
 * Response for category list endpoint (GET /categories)
 */
export type GetCategoriesResponse = ApiCategory[];

/**
 * Response for single category endpoint (GET /categories/:slug)
 */
export type GetCategoryResponse = ApiCategory;

/**
 * Response for article list endpoint (GET /articles)
 */
export type GetArticlesResponse = ApiArticle[];

/**
 * Response for single article endpoint (GET /articles/:id)
 */
export type GetArticleResponse = ApiArticle;

/**
 * Response for related articles (GET /articles/:id/related)
 */
export type GetRelatedArticlesResponse = ApiArticle[];

/**
 * Response for latest articles (GET /news/latest)
 */
export type GetLatestArticlesResponse = ApiArticle[];

/**
 * Response for trending articles (GET /news/trending)
 */
export type GetTrendingArticlesResponse = ApiArticle[];

/**
 * Response for featured articles (GET /news/featured)
 */
export type GetFeaturedArticlesResponse = ApiArticle[];

/**
 * Response for category articles (GET /news/by-category/:category)
 */
export type GetCategoryArticlesResponse = ApiArticle[];

/**
 * Response for source articles (GET /news/by-source/:source)
 */
export type GetSourceArticlesResponse = ApiArticle[];

/**
 * Response for search articles (GET /news/search)
 */
export type SearchArticlesResponse = ApiArticle[];

/**
 * Response for categorized articles (GET /news/categorized)
 */
export type GetCategorizedArticlesResponse = ApiArticle[];

/**
 * Response for record view (POST /articles/:id/view)
 */
export interface RecordViewResponse {
  success: boolean;
  message: string;
  view_count?: number;
}

/* -------------------------------------------------------------------------- */
/*                              UTILITY TYPES                                 */
/* -------------------------------------------------------------------------- */

/**
 * Type for article ID parameter
 */
export type ArticleId = string;

/**
 * Type for category slug parameter
 */
export type CategorySlug = string;

/**
 * Union type of all possible API responses
 */
export type NewsApiResponse =
  | GetCategoriesResponse
  | GetCategoryResponse
  | GetArticlesResponse
  | GetArticleResponse
  | GetRelatedArticlesResponse
  | GetLatestArticlesResponse
  | GetTrendingArticlesResponse
  | GetFeaturedArticlesResponse
  | GetCategoryArticlesResponse
  | GetSourceArticlesResponse
  | SearchArticlesResponse
  | GetCategorizedArticlesResponse
  | RecordViewResponse;

/**
 * Type guard to check if response is an error
 */
export function isApiErrorResponse(
  response: ApiSuccessResponse<unknown> | ApiErrorResponse
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Options for mutation callbacks
 */
export interface MutationCallbacks<TData, TError = ApiErrorResponse> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

/**
 * Parameters for article view recording
 */
export interface RecordViewParams {
  id: ArticleId;
}

/**
 * Parameters for related articles query
 */
export interface RelatedArticlesParams {
  id: ArticleId;
  limit?: number;
}

/* -------------------------------------------------------------------------- */
/*                         FRONTEND-SPECIFIC TYPES                            */
/* -------------------------------------------------------------------------- */

/**
 * Ad placement type
 */
export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  clickUrl: string;
  type: 'banner' | 'sidebar' | 'inline' | 'bottom';
  placement: string[];
  company: string;
  isActive: boolean;
}

/**
 * Search result with pagination
 */
export interface SearchResult {
  articles: Article[];
  totalCount: number;
}

/**
 * Pagination props for components
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* -------------------------------------------------------------------------- */
/*                           EXPORT ALL TYPES                                 */
/* -------------------------------------------------------------------------- */

export default {
  // Enums
  ArticleStatus,
  CategoryStatus,
  
  // Type guards
  isApiErrorResponse,
};
