// src/services/news/articleService.ts
import { apiEndpoints } from '../api/endpoints';
import { type Article, type ApiArticle, type ArticleFilters } from '../../types/news';

export class ArticleService {
  async getArticles(filters: ArticleFilters = {}): Promise<Article[]> {
    try {
      const apiArticles = await apiEndpoints.articles.list(filters);
      return Array.isArray(apiArticles) 
        ? apiArticles.map(article => this.formatArticle(article))
        : [];
    } catch (error) {
      console.error('ArticleService.getArticles error:', error);
      throw error;
    }
  }

  async getArticle(id: string): Promise<Article | null> {
    try {
      const apiArticle = await apiEndpoints.articles.get(id);
      return apiArticle ? this.formatArticle(apiArticle) : null;
    } catch (error) {
      console.error(`ArticleService.getArticle(${id}) error:`, error);
      return null;
    }
  }

  // NEW METHOD: Get article by slug directly from backend
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const apiArticle = await apiEndpoints.articles.getBySlug(slug);
      return apiArticle ? this.formatArticle(apiArticle) : null;
    } catch (error) {
      console.error(`ArticleService.getArticleBySlug(${slug}) error:`, error);
      return null;
    }
  }

  // Keep this for backward compatibility if needed
  async getArticleIdBySlug(slug: string): Promise<string | null> {
    try {
      const article = await this.getArticleBySlug(slug);
      return article?.id || null;
    } catch (error) {
      console.error(`ArticleService.getArticleIdBySlug(${slug}) error:`, error);
      return null;
    }
  }

  async getLatestArticles(limit: number = 10): Promise<Article[]> {
    try {
      const apiArticles = await apiEndpoints.news.latest(limit);
      return Array.isArray(apiArticles)
        ? apiArticles.map(article => this.formatArticle(article))
        : [];
    } catch (error) {
      console.error('ArticleService.getLatestArticles error:', error);
      return [];
    }
  }

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    try {
      const apiArticles = await apiEndpoints.news.trending(limit);
      return Array.isArray(apiArticles)
        ? apiArticles.map(article => this.formatArticle(article))
        : [];
    } catch (error) {
      console.error('ArticleService.getTrendingArticles error:', error);
      return [];
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const apiArticles = await apiEndpoints.news.featured();
      return Array.isArray(apiArticles)
        ? apiArticles.map(article => this.formatArticle(article))
        : [];
    } catch (error) {
      console.error('ArticleService.getFeaturedArticles error:', error);
      return [];
    }
  }

  async getArticlesByCategory(category: string, limit?: number): Promise<Article[]> {
    try {
      const apiArticles = await apiEndpoints.news.byCategory(category, limit);
      return Array.isArray(apiArticles)
        ? apiArticles.map(article => this.formatArticle(article))
        : [];
    } catch (error) {
      console.error(`ArticleService.getArticlesByCategory(${category}) error:`, error);
      return [];
    }
  }

  async searchArticles(query: string, limit?: number): Promise<Article[]> {
    try {
      if (!query.trim()) return [];
      const apiArticles = await apiEndpoints.news.search(query, limit);
      return Array.isArray(apiArticles)
        ? apiArticles.map(article => this.formatArticle(article))
        : [];
    } catch (error) {
      console.error(`ArticleService.searchArticles(${query}) error:`, error);
      return [];
    }
  }

  async getRelatedArticles(articleId: string, limit: number = 3): Promise<Article[]> {
    try {
      const apiArticles = await apiEndpoints.articles.related(articleId);
      return Array.isArray(apiArticles)
        ? apiArticles.map(article => this.formatArticle(article)).slice(0, limit)
        : [];
    } catch (error) {
      console.error(`ArticleService.getRelatedArticles(${articleId}) error:`, error);
      return [];
    }
  }

  async recordView(articleId: string): Promise<void> {
    try {
      await apiEndpoints.articles.recordView(articleId);
    } catch (error) {
      console.error(`ArticleService.recordView(${articleId}) error:`, error);
      // Don't throw - view recording is non-critical
    }
  }

  private formatArticle(apiArticle: ApiArticle): Article {
    const wordCount = apiArticle.content ? apiArticle.content.split(/\s+/).length : 100;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const summary = apiArticle.description || 
                   apiArticle.meta_description || 
                   apiArticle.excerpt || 
                   apiArticle.summary ||
                   this.createSummary(apiArticle.title);

    const content = apiArticle.content || 
                   apiArticle.description || 
                   apiArticle.summary || 
                   '';

    const tags = this.parseTags(apiArticle.tags as any, apiArticle.category);

    return {
      id: apiArticle.id.toString(),
      title: apiArticle.title,
      summary: summary,
      content: content,
      author: apiArticle.author || 'DefinePress Staff',
      publishedAt: apiArticle.published_at,
      imageUrl: apiArticle.image_url || this.getFallbackImage(apiArticle.category),
      category: apiArticle.category,
      readTime: readTime,
      tags: tags,
      url: apiArticle.url,
      source: apiArticle.source || undefined,
      viewCount: apiArticle.view_count,
      isFeatured: apiArticle.is_featured,
      slug: apiArticle.slug,  // Make sure slug is included
    };
  }

  private parseTags(tags: string | string[] | null, category: string): string[] {
    if (!tags) return [category];

    try {
      if (typeof tags === 'string') {
        // Try parsing as JSON first
        try {
          const parsed = JSON.parse(tags);
          return Array.isArray(parsed) ? parsed : [category];
        } catch {
          // Parse as comma-separated string
          return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }
      return Array.isArray(tags) ? tags : [category];
    } catch {
      return [category];
    }
  }

  private createSummary(title: string): string {
    return `${title}. Read more for the full story and latest updates.`;
  }

  private getFallbackImage(category: string): string {
    const fallbackImages: { [key: string]: string } = {
      'world': 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg',
      'business': 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg',
      'technology': 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
      'sports': 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      'health': 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
      'science': 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg',
      'entertainment': 'https://images.pexels.com/photos/1299391/pexels-photo-1299391.jpeg',
      'general': 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg',
    };

    return fallbackImages[category] || fallbackImages['general'];
  }
}

export const articleService = new ArticleService();