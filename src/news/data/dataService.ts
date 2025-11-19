import { type Article, type Category, type ArticleFilters } from '../types/news';
import { categoryService } from '../services/news/categoryService';
import { articleService } from '../services/news/articleService';

/**
 * DataService - Safe, non-recursive data layer with caching
 */
class DataService {
  private static instance: DataService | null = null;

  // Caches
  private categoriesCache: { data: Category[]; fetchedAt: number } | null = null;
  private articlesCache: Map<string, { data: Article[]; fetchedAt: number }> = new Map();

  // Cache TTL (5 minutes)
  private readonly DEFAULT_TTL = 1000 * 60 * 5;

  // Static fallback categories
  private staticCategories: Category[] = [
    { id: '1', name: 'General', slug: 'general', description: 'General news and current events', color: 'bg-gray-500' },
    { id: '2', name: 'Technology', slug: 'technology', description: 'Latest in tech and innovation', color: 'bg-blue-500' },
    { id: '3', name: 'Business', slug: 'business', description: 'Financial markets and business news', color: 'bg-green-500' },
    { id: '4', name: 'Sports', slug: 'sports', description: 'Sports news and updates', color: 'bg-orange-500' },
    { id: '5', name: 'Health', slug: 'health', description: 'Health and wellness news', color: 'bg-purple-500' },
    { id: '6', name: 'Science', slug: 'science', description: 'Scientific discoveries and research', color: 'bg-indigo-500' }
  ];

  // Mock articles for fallback/demo
  private mockArticles: Article[] = [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in 2024',
      summary: 'Exploring the latest advancements in AI and machine learning that are shaping our future.',
      content: 'Artificial intelligence continues to evolve at an unprecedented pace. New breakthroughs in machine learning algorithms and neural networks are enabling applications we could only dream of a few years ago.',
      author: 'Tech Insights',
      publishedAt: new Date().toISOString(),
      imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
      category: 'technology',
      readTime: 4,
      tags: ['AI', 'Machine Learning', 'Technology']
    },
    {
      id: '2',
      title: 'Global Markets Show Strong Recovery Signs',
      summary: 'Economic indicators point towards sustained growth in major markets worldwide.',
      content: 'Financial markets around the world are showing promising signs of recovery as economic indicators improve and investor confidence returns.',
      author: 'Financial Times',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      imageUrl: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg',
      category: 'business',
      readTime: 3,
      tags: ['Markets', 'Economy', 'Finance']
    },
    {
      id: '3',
      title: 'Championship Finals Set After Thrilling Semis',
      summary: 'Underdog team advances to finals in stunning upset victory that shocked fans.',
      content: 'In a dramatic turn of events, the underdog team secured their spot in the championship finals with a performance that will be remembered for years to come.',
      author: 'Sports Network',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      imageUrl: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      category: 'sports',
      readTime: 2,
      tags: ['Championship', 'Sports', 'Victory']
    },
    {
      id: '4',
      title: 'Breakthrough in Renewable Energy Storage',
      summary: 'New battery technology promises to revolutionize how we store solar and wind energy.',
      content: 'Scientists have developed a new battery technology that could solve one of renewable energy\'s biggest challenges: reliable storage for times when the sun isn\'t shining and the wind isn\'t blowing.',
      author: 'Science Daily',
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      imageUrl: 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg',
      category: 'science',
      readTime: 5,
      tags: ['Energy', 'Innovation', 'Research']
    }
  ];

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

    if (!force && this.categoriesCache) {
      const age = Date.now() - this.categoriesCache.fetchedAt;
      if (age < this.DEFAULT_TTL) {
        return this.categoriesCache.data;
      }
    }

    try {
      const cats = await categoryService.getCategories();
      const safeCats = Array.isArray(cats) && cats.length > 0 ? cats : this.staticCategories;
      this.categoriesCache = { data: safeCats, fetchedAt: Date.now() };
      return safeCats;
    } catch (err) {
      console.error('DataService.getCategories: failed to fetch categories, using fallback', err);
      if (this.categoriesCache) return this.categoriesCache.data;
      return this.staticCategories;
    }
  }

  getCategoriesSync(): Category[] {
    try {
      if (this.categoriesCache) return this.categoriesCache.data;
      return this.staticCategories;
    } catch (err) {
      console.error('DataService.getCategoriesSync: unexpected error', err);
      return this.staticCategories;
    }
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    const cats = await this.getCategories();
    return cats.find((c) => c.slug === slug);
  }

  async getPopularCategories(limit: number = 6): Promise<Category[]> {
    try {
      const cats = await this.getCategories();
      return cats.slice(0, limit);
    } catch (err) {
      console.error('DataService.getPopularCategories failed', err);
      return this.staticCategories.slice(0, limit);
    }
  }

  // ----------------------
  // Articles
  // ----------------------

  async getArticles(filters: ArticleFilters = {}, options?: { forceRefresh?: boolean }): Promise<Article[]> {
    const cacheKey = this.generateCacheKey('articles', filters);
    const force = options?.forceRefresh ?? false;

    const cached = this.articlesCache.get(cacheKey);
    if (!force && cached && Date.now() - cached.fetchedAt < this.DEFAULT_TTL) {
      return cached.data;
    }

    try {
      const articles = await articleService.getArticles(filters);
      const normalized = Array.isArray(articles) ? articles : [];
      this.articlesCache.set(cacheKey, { data: normalized, fetchedAt: Date.now() });
      return normalized;
    } catch (err) {
      console.error('DataService.getArticles: failed to fetch, using fallback', err);
      
      // Return mock articles as fallback filtered by category if specified
      if (filters.category) {
        return this.mockArticles.filter(article => article.category === filters.category).slice(0, filters.limit || 10);
      }
      
      if (cached) return cached.data;
      return this.mockArticles.slice(0, filters.limit || 10);
    }
  }

  async getArticleById(id: string): Promise<Article | null> {
    try {
      const art = await articleService.getArticle(id);
      return art ?? null;
    } catch (err) {
      console.error(`DataService.getArticleById(${id}) failed`, err);
      // Return mock article as fallback
      return this.mockArticles.find(article => article.id === id) || null;
    }
  }

  async getArticlesByCategory(category: string, limit?: number, options?: { forceRefresh?: boolean }): Promise<Article[]> {
    const filters: ArticleFilters = { category, limit };
    return this.getArticles(filters, options);
  }

  async getLatestArticles(limit: number = 10, options?: { forceRefresh?: boolean }): Promise<Article[]> {
    const filters: ArticleFilters = { limit, sortBy: 'publishedAt', order: 'desc' };
    return this.getArticles(filters, options);
  }

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    try {
      const arts = await articleService.getTrendingArticles(limit);
      return Array.isArray(arts) ? arts : [];
    } catch (err) {
      console.error('DataService.getTrendingArticles failed', err);
      return this.getLatestArticles(limit);
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const arts = await articleService.getFeaturedArticles();
      return Array.isArray(arts) ? arts : [];
    } catch (err) {
      console.error('DataService.getFeaturedArticles failed', err);
      return this.mockArticles.filter(article => article.category === 'technology').slice(0, 3);
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    try {
      const arts = await articleService.searchArticles(query);
      return Array.isArray(arts) ? arts : [];
    } catch (err) {
      console.error('DataService.searchArticles failed', err);
      return this.mockArticles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  async getRelatedArticles(currentArticle: Article, limit: number = 3): Promise<Article[]> {
    try {
      const arts = await articleService.getRelatedArticles(currentArticle.id, limit);
      return Array.isArray(arts) ? arts : [];
    } catch (err) {
      console.error('DataService.getRelatedArticles failed', err);
      return this.mockArticles
        .filter(article => article.id !== currentArticle.id && article.category === currentArticle.category)
        .slice(0, limit);
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

  // ----------------------
  // Utilities
  // ----------------------

  private generateCacheKey(prefix: string, filters: ArticleFilters = {}): string {
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

// Synchronous categories export for immediate use
export const categories = dataService.getCategoriesSync();

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

export default dataService;