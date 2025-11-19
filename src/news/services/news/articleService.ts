import { apiEndpoints } from '../api/endpoints';
import { type Article, type ApiArticle,type  ArticleFilters } from '../../types/news';

export class ArticleService {
  async getArticles(filters: ArticleFilters = {}): Promise<Article[]> {
    const apiArticles = await apiEndpoints.articles.list(filters);
    return apiArticles.map(article => this.formatArticle(article));
  }

  async getArticle(id: string): Promise<Article | null> {
    try {
      const apiArticle = await apiEndpoints.articles.get(id);
      return this.formatArticle(apiArticle);
    } catch (error) {
      console.error('Error fetching article:', error);
      return null;
    }
  }

  async getLatestArticles(limit: number = 10): Promise<Article[]> {
    const apiArticles = await apiEndpoints.news.latest(limit);
    return apiArticles.map(article => this.formatArticle(article));
  }

  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    const apiArticles = await apiEndpoints.news.trending(limit);
    return apiArticles.map(article => this.formatArticle(article));
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const apiArticles = await apiEndpoints.news.featured();
    return apiArticles.map(article => this.formatArticle(article));
  }

  async getArticlesByCategory(category: string, limit?: number): Promise<Article[]> {
  try {
    const articles = await articleService.getArticlesByCategory(category, limit);
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    console.error(`Error getting articles for category ${category}:`, error);
    return [];
  }
}

  async getArticlesBySource(source: string, limit?: number): Promise<Article[]> {
    const apiArticles = await apiEndpoints.news.bySource(source, limit);
    return apiArticles.map(article => this.formatArticle(article));
  }

  async searchArticles(query: string, limit?: number): Promise<Article[]> {
    const apiArticles = await apiEndpoints.news.search(query, limit);
    return apiArticles.map(article => this.formatArticle(article));
  }

  async getRelatedArticles(articleId: string, limit: number = 3): Promise<Article[]> {
    try {
      const apiArticles = await apiEndpoints.articles.related(articleId);
      return apiArticles.map(article => this.formatArticle(article)).slice(0, limit);
    } catch (error) {
      console.error('Error fetching related articles:', error);
      return [];
    }
  }

  async recordView(articleId: string): Promise<void> {
    try {
      await apiEndpoints.articles.recordView(articleId);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  }

  private formatArticle(apiArticle: ApiArticle): Article {
    const wordCount = apiArticle.content ? apiArticle.content.split(/\s+/).length : 100;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const summary = apiArticle.description || 
                   apiArticle.meta_description || 
                   apiArticle.excerpt || 
                   this.createSummary(apiArticle.title);

    const content = apiArticle.content || 
                   apiArticle.description || 
                   apiArticle.summary || 
                   '';

    const tags = this.parseTags(apiArticle.tags, apiArticle.category);

    return {
      id: apiArticle.id.toString(),
      title: apiArticle.title,
      summary: summary,
      content: content,
      author: apiArticle.author || 'Unknown Author',
      publishedAt: apiArticle.published_at,
      imageUrl: apiArticle.image_url || this.getFallbackImage(apiArticle.category),
      category: apiArticle.category,
      readTime: readTime,
      tags: tags,
      url: apiArticle.url,
      source: apiArticle.source || undefined,
      viewCount: apiArticle.view_count,
      isFeatured: apiArticle.is_featured,
    };
  }

  private parseTags(tags: string | null, category: string): string[] {
    if (!tags) {
      return [category];
    }

    try {
      if (typeof tags === 'string') {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) ? parsed : [category];
      }
      return Array.isArray(tags) ? tags : [category];
    } catch {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
  }

  private createSummary(title: string): string {
    return `${title}. Read more for the full story.`;
  }

  private getFallbackImage(category: string): string {
    const fallbackImages: { [key: string]: string } = {
      'world': 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg',
      'business': 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg',
      'technology': 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
      'sports': 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
      'health': 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
      'science': 'https://images.pexels.com/photos-256262/pexels-photo-256262.jpeg',
      'general': 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg',
    };

    return fallbackImages[category] || 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg';
  }
}

export const articleService = new ArticleService();