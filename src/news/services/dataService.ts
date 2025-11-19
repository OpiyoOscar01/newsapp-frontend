import { type Article, type Category,type  ArticleFilters } from '../types/news';
import { categoryService } from './news/categoryService';
import { articleService } from './news/articleService';

class DataService {
  private categoriesCache: Category[] | null = null;
  private articlesCache: Map<string, Article[]> = new Map();

  // Categories
  async getCategories(): Promise<Category[]> {
    if (!this.categoriesCache) {
      this.categoriesCache = await categoryService.getCategories();
    }
    return this.categoriesCache;
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    const categories = await this.getCategories();
    return categories.find(cat => cat.slug === slug);
  }

  async getPopularCategories(limit: number = 6): Promise<Category[]> {
    return categoryService.getPopularCategories(limit);
  }

  // Articles
  async getArticles(filters: ArticleFilters = {}): Promise<Article[]> {
    const cacheKey = this.generateCacheKey('articles', filters);
    
    if (!this.articlesCache.has(cacheKey)) {
      const articles = await articleService.getArticles(filters);
      this.articlesCache.set(cacheKey, articles);
    }
    
    return this.articlesCache.get(cacheKey) || [];
  }

  async getArticleById(id: string): Promise<Article | null> {
    return articleService.getArticle(id);
  }

  async getArticlesByCategory(category: string, limit?: number): Promise<Article[]> {
    return articleService.getArticlesByCategory(category, limit);
  }

  async getLatestArticles(limit: number = 10): Promise<Article[]> {
    return articleService.getLatestArticles(limit);
  }

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    return articleService.getTrendingArticles(limit);
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return articleService.getFeaturedArticles();
  }

  async searchArticles(query: string): Promise<Article[]> {
    return articleService.searchArticles(query);
  }

  async getRelatedArticles(currentArticle: Article, limit: number = 3): Promise<Article[]> {
    return articleService.getRelatedArticles(currentArticle.id, limit);
  }

  async recordArticleView(articleId: string): Promise<void> {
    await articleService.recordView(articleId);
  }

  // Cache management
  clearCache(): void {
    this.categoriesCache = null;
    this.articlesCache.clear();
  }

  private generateCacheKey(prefix: string, filters: ArticleFilters = {}): string {
    const params = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    return params ? `${prefix}?${params}` : prefix;
  }
}

export const dataService = new DataService();

// Export legacy functions for easy migration
export const getArticlesByCategory = dataService.getArticlesByCategory.bind(dataService);
export const getArticleById = dataService.getArticleById.bind(dataService);
export const getRelatedArticles = dataService.getRelatedArticles.bind(dataService);
export const searchArticles = dataService.searchArticles.bind(dataService);