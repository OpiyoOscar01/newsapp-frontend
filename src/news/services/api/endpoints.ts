import { apiClient } from './client';
import { type ApiArticle,type ApiCategory, type ArticleFilters,} from '../../types/news'

export const apiEndpoints = {
  // Categories
  categories: {
    list: () => apiClient.get<ApiCategory[]>('/categories'),
    get: (slug: string) => apiClient.get<ApiCategory>(`/categories/${slug}`),
  },

  // Articles
  articles: {
    list: (params?: ArticleFilters) => 
      apiClient.get<ApiArticle[]>(`/articles`, params),
    
    get: (id: string) => 
      apiClient.get<ApiArticle>(`/articles/${id}`),
    
    recordView: (id: string) => 
      apiClient.post(`/articles/${id}/view`),
    
    related: (id: string) => 
      apiClient.get<ApiArticle[]>(`/articles/${id}/related`),
  },

  // News
  news: {
    latest: (limit?: number) => 
      apiClient.get<ApiArticle[]>(`/news/latest`, { limit }),
    
    trending: (limit?: number) => 
      apiClient.get<ApiArticle[]>(`/news/trending`, { limit }),
    
    featured: () => 
      apiClient.get<ApiArticle[]>(`/news/featured`),
    
    byCategory: (category: string, limit?: number) => 
      apiClient.get<ApiArticle[]>(`/news/by-category/${category}`, { limit }),
    
    bySource: (source: string, limit?: number) => 
      apiClient.get<ApiArticle[]>(`/news/by-source/${source}`, { limit }),
    
    search: (query: string, limit?: number) => 
      apiClient.get<ApiArticle[]>(`/news/search`, { q: query, limit }),
    
    categorized: (categories?: string[], limit?: number) => 
      apiClient.get<ApiArticle[]>(`/news/categorized`, { 
        categories: categories?.join(','), 
        limit 
      }),
  },

  // MediaStack
  mediastack: {
    testConnection: () => 
      apiClient.post(`/mediastack/test-connection`),
    
    status: () => 
      apiClient.get(`/mediastack/status`),
    
    usageStats: () => 
      apiClient.get(`/mediastack/usage-stats`),
  },
};