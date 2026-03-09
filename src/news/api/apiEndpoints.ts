// api/endpoints.ts
import { axiosInstance } from './axiosConfig'; 
import type {
  ArticleFilters,
  GetCategoriesResponse,
  GetCategoryResponse,
  GetArticlesResponse,
  GetArticleResponse,
  GetRelatedArticlesResponse,
  GetLatestArticlesResponse,
  GetTrendingArticlesResponse,
  GetFeaturedArticlesResponse,
  GetCategoryArticlesResponse,
  GetSourceArticlesResponse,
  SearchArticlesResponse,
  GetCategorizedArticlesResponse,
  RecordViewResponse,
}  from './NewsTypes';

/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions with typed responses
 */
export const apiEndpoints = {
  // ============================================================================
  // CATEGORIES
  // ============================================================================
  categories: {
    /**
     * Get all categories
     * GET /categories
     */
    list: () => axiosInstance.get<GetCategoriesResponse>('/categories'),
    
    /**
     * Get single category by slug
     * GET /categories/:slug
     */
    get: (slug: string) => axiosInstance.get<GetCategoryResponse>(`/categories/${slug}`),
  },

  // ============================================================================
  // ARTICLES
  // ============================================================================
  articles: {
    /**
     * List articles with filters
     * GET /articles
     */
    list: (params?: ArticleFilters) => 
      axiosInstance.get<GetArticlesResponse>('/articles', { params }),
    
    /**
     * Get single article by ID
     * GET /articles/:id
     */
    get: (id: string) => 
      axiosInstance.get<GetArticleResponse>(`/articles/${id}`),
    
    /**
     * Record article view
     * POST /articles/:id/view
     */
    recordView: (id: string) => 
      axiosInstance.post<RecordViewResponse>(`/articles/${id}/view`),
    
    /**
     * Get related articles
     * GET /articles/:id/related
     */
    related: (id: string) => 
      axiosInstance.get<GetRelatedArticlesResponse>(`/articles/${id}/related`),
  },

  // ============================================================================
  // NEWS
  // ============================================================================
  news: {
    /**
     * Get latest articles
     * GET /news/latest
     */
    latest: (limit?: number) => 
      axiosInstance.get<GetLatestArticlesResponse>('/news/latest', { params: { limit } }),
    
    /**
     * Get trending articles
     * GET /news/trending
     */
    trending: (limit?: number) => 
      axiosInstance.get<GetTrendingArticlesResponse>('/news/trending', { params: { limit } }),
    
    /**
     * Get featured articles
     * GET /news/featured
     */
    featured: () => 
      axiosInstance.get<GetFeaturedArticlesResponse>('/news/featured'),
    
    /**
     * Get articles by category
     * GET /news/by-category/:category
     */
    byCategory: (category: string, limit?: number) => 
      axiosInstance.get<GetCategoryArticlesResponse>(
        `/news/by-category/${category}`, 
        { params: { limit } }
      ),
    
    /**
     * Get articles by source
     * GET /news/by-source/:source
     */
    bySource: (source: string, limit?: number) => 
      axiosInstance.get<GetSourceArticlesResponse>(
        `/news/by-source/${source}`, 
        { params: { limit } }
      ),
    
    /**
     * Search articles
     * GET /news/search
     */
    search: (query: string, limit?: number) => 
      axiosInstance.get<SearchArticlesResponse>(
        '/news/search', 
        { params: { q: query, limit } }
      ),
    
    /**
     * Get categorized articles
     * GET /news/categorized
     */
    categorized: (categories?: string[], limit?: number) => 
      axiosInstance.get<GetCategorizedArticlesResponse>('/news/categorized', { 
        params: { 
          categories: categories?.join(','), 
          limit 
        } 
      }),
  },

  // ============================================================================
  // MEDIASTACK (External API)
  // ============================================================================
  mediastack: {
    /**
     * Test MediaStack connection
     * POST /mediastack/test-connection
     */
    testConnection: () => 
      axiosInstance.post('/mediastack/test-connection'),
    
    /**
     * Get MediaStack status
     * GET /mediastack/status
     */
    status: () => 
      axiosInstance.get('/mediastack/status'),
    
    /**
     * Get MediaStack usage stats
     * GET /mediastack/usage-stats
     */
    usageStats: () => 
      axiosInstance.get('/mediastack/usage-stats'),
  },
};

export default apiEndpoints;
