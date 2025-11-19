import { apiEndpoints } from '../api/endpoints';
import { type Category, type ApiCategory, type ApiArticle } from '../../types/news';

export class CategoryService {
  private colorMap: Map<string, string>;

  constructor() {
    this.colorMap = new Map([
      ['world', 'bg-red-500'],
      ['business', 'bg-green-500'],
      ['technology', 'bg-blue-500'],
      ['sports', 'bg-orange-500'],
      ['health', 'bg-purple-500'],
      ['science', 'bg-indigo-500'],
      ['general', 'bg-gray-500'],
      ['entertainment', 'bg-pink-500'],
      ['politics', 'bg-yellow-500'],
      ['environment', 'bg-emerald-500'],
      ['finance', 'bg-lime-500'],
      ['education', 'bg-cyan-500'],
    ]);
  }

  async getCategories(): Promise<Category[]> {
    try {
      const apiCategories = await apiEndpoints.categories.list();
      
      if (Array.isArray(apiCategories) && apiCategories.length > 0) {
        return apiCategories.map(cat => this.formatCategory(cat));
      }
      
      // Fallback: Extract from articles
      console.warn('No categories from API, extracting from articles...');
      return this.extractCategoriesFromArticles();
    } catch (error) {
      console.error('CategoryService.getCategories error:', error);
      return this.extractCategoriesFromArticles();
    }
  }

  async getCategory(slug: string): Promise<Category | null> {
    try {
      const apiCategory = await apiEndpoints.categories.get(slug);
      return apiCategory ? this.formatCategory(apiCategory) : null;
    } catch (error) {
      console.error(`CategoryService.getCategory(${slug}) error:`, error);
      // Try to find from all categories
      const categories = await this.getCategories();
      return categories.find(cat => cat.slug === slug) || null;
    }
  }

  async getPopularCategories(limit: number = 6): Promise<Category[]> {
    try {
      const categories = await this.getCategories();
      return categories
        .sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('CategoryService.getPopularCategories error:', error);
      return [];
    }
  }

  private async extractCategoriesFromArticles(): Promise<Category[]> {
    try {
      const articles = await apiEndpoints.articles.list({ perPage: 100 });
      
      if (!Array.isArray(articles) || articles.length === 0) {
        return this.getFallbackCategories();
      }
      
      return this.buildCategoriesFromArticles(articles);
    } catch (error) {
      console.error('CategoryService.extractCategoriesFromArticles error:', error);
      return this.getFallbackCategories();
    }
  }

  private buildCategoriesFromArticles(articles: ApiArticle[]): Category[] {
    const categoryMap = new Map<string, { count: number; name: string }>();
    
    articles.forEach(article => {
      const categorySlug = article.category || 'general';
      const categoryName = article.category_model?.name || this.formatCategoryName(categorySlug);
      
      if (categoryMap.has(categorySlug)) {
        categoryMap.get(categorySlug)!.count++;
      } else {
        categoryMap.set(categorySlug, {
          count: 1,
          name: categoryName
        });
      }
    });

    const categories: Category[] = [];
    let idCounter = 1;
    
    for (const [slug, data] of categoryMap.entries()) {
      categories.push({
        id: (idCounter++).toString(),
        name: data.name,
        slug: slug,
        description: this.generateCategoryDescription(slug, data.name),
        color: this.getCategoryColor(slug),
        articleCount: data.count,
        isActive: true
      });
    }

    return categories.sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0));
  }

  private formatCategory(apiCategory: ApiCategory): Category {
    return {
      id: apiCategory.id.toString(),
      name: apiCategory.name,
      slug: apiCategory.slug,
      description: apiCategory.description || this.generateCategoryDescription(apiCategory.slug, apiCategory.name),
      color: this.getCategoryColor(apiCategory.slug),
      isActive: apiCategory.is_active,
    };
  }

  private formatCategoryName(slug: string): string {
    return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  }

  private generateCategoryDescription(slug: string, name: string): string {
    const descriptions: { [key: string]: string } = {
      'world': 'Global news and international affairs from around the world',
      'business': 'Financial markets, economy, and business news',
      'technology': 'Latest technology trends, innovations, and digital transformation',
      'sports': 'Sports news, scores, highlights, and analysis',
      'health': 'Health, wellness, medical breakthroughs, and healthcare news',
      'science': 'Scientific discoveries, research, and innovation',
      'general': 'General news and current events',
      'entertainment': 'Entertainment news, celebrity updates, and pop culture',
      'politics': 'Political news, government affairs, and policy updates',
      'environment': 'Environmental news, climate change, and sustainability',
    };

    return descriptions[slug] || `Latest ${name} news and comprehensive coverage`;
  }

  private getCategoryColor(slug: string): string {
    if (this.colorMap.has(slug)) {
      return this.colorMap.get(slug)!;
    }

    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
      'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500',
    ];

    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  private getFallbackCategories(): Category[] {
    return [
      {
        id: '1',
        name: 'General',
        slug: 'general',
        description: 'General news and current events',
        color: 'bg-gray-500',
        isActive: true
      },
      {
        id: '2',
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology trends and innovations',
        color: 'bg-blue-500',
        isActive: true
      },
      {
        id: '3',
        name: 'Business',
        slug: 'business',
        description: 'Business and financial news',
        color: 'bg-green-500',
        isActive: true
      }
    ];
  }
}

export const categoryService = new CategoryService();
