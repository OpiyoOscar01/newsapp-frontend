// Base API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount?: number;
  isActive?: boolean;
}

export interface ApiCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Article Types
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

export interface ApiArticle {
  id: number;
  title: string;
  description: string | null;
  content: string | null;
  author: string | null;
  url: string;
  source: string | null;
  image_url: string | null;
  category: string;
  language: string | null;
  country: string | null;
  published_at: string;
  is_active: boolean;
  is_featured: boolean;
  view_count: number;
  sentiment_score: number | null;
  tags: string | null;
  keywords: string | null;
  slug: string;
  meta_description: string | null;
  reading_time: number;
  excerpt: string | null;
  created_at: string;
  updated_at: string;
  category_model?: ApiCategory;
  source_model?: any;
  summary?:string
}

// Service Types
export interface ArticleFilters {
  category?: string;
  source?: string;
  search?: string;
  page?: number;
  perPage?: number;
  featured?: boolean;
  trending?: boolean;
  limit?: number;
  sortBy?:string;
  order?:string;
}

export interface NewsStats {
  totalArticles: number;
  totalCategories: number;
  trendingCount: number;
  featuredCount: number;
}