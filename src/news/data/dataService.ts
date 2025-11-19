import { type Article, type Category, type ArticleFilters } from '../types/news';
import { categoryService } from '../services/news/categoryService';
import { articleService } from '../services/news/articleService';

/**
 * DataService - Main data access layer with caching and error handling
 */
class DataService {
  private static instance: DataService | null = null;

  // Caches with TTL
  private categoriesCache: { data: Category[]; fetchedAt: number } | null = null;
  private articlesCache: Map<string, { data: Article[]; fetchedAt: number }> = new Map();

  // Cache TTL (5 minutes)
  private readonly DEFAULT_TTL = 1000 * 60 * 5;

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // ----------------------
  // Categories
  // ----------------------

  async getCategories(options?: { forceRefresh?: boolean }): Promise<Category[]> {
    const force = options?.forceRefresh ?? false;

    // Return cached data if valid
    if (!force && this.categoriesCache) {
      const age = Date.now() - this.categoriesCache.fetchedAt;
      if (age < this.DEFAULT_TTL) {
        return this.categoriesCache.data;
      }
    }

    try {
      const categories = await categoryService.getCategories();
      this.categoriesCache = { data: categories, fetchedAt: Date.now() };
      return categories;
    } catch (err) {
      console.error('DataService.getCategories: failed to fetch', err);
      // Return cached data if available
      if (this.categoriesCache) return this.categoriesCache.data;
      // Return empty array as last resort
      return [];
    }
  }

  getCategoriesSync(): Category[] {
    return this.categoriesCache?.data || [];
  }

  async getCategory(slug: string): Promise<Category | null> {
    try {
      const categories = await this.getCategories();
      return categories.find(c => c.slug === slug) || null;
    } catch (err) {
      console.error(`DataService.getCategory(${slug}) failed`, err);
      return null;
    }
  }

  async getPopularCategories(limit: number = 6): Promise<Category[]> {
    try {
      return await categoryService.getPopularCategories(limit);
    } catch (err) {
      console.error('DataService.getPopularCategories failed', err);
      const categories = await this.getCategories();
      return categories.slice(0, limit);
    }
  }

  // ----------------------
  // Articles
  // ----------------------

  async getArticles(filters: ArticleFilters = {}, options?: { forceRefresh?: boolean }): Promise<Article[]> {
    const cacheKey = this.generateCacheKey('articles', filters);
    const force = options?.forceRefresh ?? false;

    // Return cached data if valid
    const cached = this.articlesCache.get(cacheKey);
    if (!force && cached && Date.now() - cached.fetchedAt < this.DEFAULT_TTL) {
      return cached.data;
    }

    try {
      const articles = await articleService.getArticles(filters);
      this.articlesCache.set(cacheKey, { data: articles, fetchedAt: Date.now() });
      return articles;
    } catch (err) {
      console.error('DataService.getArticles: failed to fetch', err);
      // Return cached data if available
      if (cached) return cached.data;
      return [];
    }
  }

  async getArticleById(id: string): Promise<Article | null> {
    try {
      return await articleService.getArticle(id);
    } catch (err) {
      console.error(`DataService.getArticleById(${id}) failed`, err);
      return null;
    }
  }

  async getArticlesByCategory(category: string, limit?: number, options?: { forceRefresh?: boolean }): Promise<Article[]> {
    const cacheKey = this.generateCacheKey('category', { category, limit });
    const force = options?.forceRefresh ?? false;

    const cached = this.articlesCache.get(cacheKey);
    if (!force && cached && Date.now() - cached.fetchedAt < this.DEFAULT_TTL) {
      return cached.data;
    }

    try {
      const articles = await articleService.getArticlesByCategory(category, limit);
      this.articlesCache.set(cacheKey, { data: articles, fetchedAt: Date.now() });
      return articles;
    } catch (err) {
      console.error(`DataService.getArticlesByCategory(${category}) failed`, err);
      if (cached) return cached.data;
      return [];
    }
  }

  async getLatestArticles(limit: number = 10, options?: { forceRefresh?: boolean }): Promise<Article[]> {
    const cacheKey = this.generateCacheKey('latest', { limit });
    const force = options?.forceRefresh ?? false;

    const cached = this.articlesCache.get(cacheKey);
    if (!force && cached && Date.now() - cached.fetchedAt < this.DEFAULT_TTL) {
      return cached.data;
    }

    try {
      const articles = await articleService.getLatestArticles(limit);
      this.articlesCache.set(cacheKey, { data: articles, fetchedAt: Date.now() });
      return articles;
    } catch (err) {
      console.error('DataService.getLatestArticles failed', err);
      if (cached) return cached.data;
      return [];
    }
  }

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    try {
      return await articleService.getTrendingArticles(limit);
    } catch (err) {
      console.error('DataService.getTrendingArticles failed', err);
      return this.getLatestArticles(limit);
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      return await articleService.getFeaturedArticles();
    } catch (err) {
      console.error('DataService.getFeaturedArticles failed', err);
      return this.getLatestArticles(3);
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    if (!query.trim()) return [];
    
    try {
      return await articleService.searchArticles(query);
    } catch (err) {
      console.error(`DataService.searchArticles(${query}) failed`, err);
      return [];
    }
  }

  async getRelatedArticles(currentArticle: Article, limit: number = 3): Promise<Article[]> {
    try {
      const related = await articleService.getRelatedArticles(currentArticle.id, limit);
      
      // If no related articles, fallback to same category
      if (related.length === 0) {
        const categoryArticles = await this.getArticlesByCategory(currentArticle.category, limit + 1);
        return categoryArticles.filter(a => a.id !== currentArticle.id).slice(0, limit);
      }
      
      return related;
    } catch (err) {
      console.error(`DataService.getRelatedArticles(${currentArticle.id}) failed`, err);
      return [];
    }
  }

  async recordArticleView(articleId: string): Promise<void> {
    try {
      await articleService.recordView(articleId);
    } catch (err) {
      console.error(`DataService.recordArticleView(${articleId}) failed`, err);
    }
  }

  // ----------------------
  // Cache management
  // ----------------------

  clearCache(): void {
    this.categoriesCache = null;
    this.articlesCache.clear();
  }

  invalidateArticlesCache(filters: ArticleFilters = {}): void {
    const key = this.generateCacheKey('articles', filters);
    this.articlesCache.delete(key);
  }

  invalidateCategoryCache(category: string): void {
    const keys = Array.from(this.articlesCache.keys()).filter(k => k.includes(`category=${category}`));
    keys.forEach(key => this.articlesCache.delete(key));
  }

  // ----------------------
  // Utilities
  // ----------------------

  private generateCacheKey(prefix: string, filters: Record<string, any> = {}): string {
    const params = Object.entries(filters)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}=${String(v)}`)
      .sort()
      .join('&');
    return params ? `${prefix}?${params}` : prefix;
  }
}

// Singleton instance
export const dataService = DataService.getInstance();

// Named exports for compatibility
export const getArticlesByCategory = (category: string, limit?: number) => 
  dataService.getArticlesByCategory(category, limit);

export const getArticleById = (id: string) => 
  dataService.getArticleById(id);

export const getRelatedArticles = (article: Article, limit?: number) => 
  dataService.getRelatedArticles(article, limit);

export const searchArticles = (query: string) => 
  dataService.searchArticles(query);

export const getCategories = () => dataService.getCategories();
export const getCategoriesSync = () => dataService.getCategoriesSync();
export const getCategory = (slug: string) => dataService.getCategory(slug);
export const getPopularCategories = (limit?: number) => dataService.getPopularCategories(limit);
export const getArticles = (filters?: ArticleFilters) => dataService.getArticles(filters);
export const getLatestArticles = (limit?: number) => dataService.getLatestArticles(limit);
export const getTrendingArticles = (limit?: number) => dataService.getTrendingArticles(limit);
export const getFeaturedArticles = () => dataService.getFeaturedArticles();
export const recordArticleView = (id: string) => dataService.recordArticleView(id);
export const clearCache = () => dataService.clearCache();

// Export categories synchronously (they're loaded during navigation)
export const categories = dataService.getCategoriesSync();

export default dataService;
