// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

export interface ApiArticle {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  meta_description?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  published_at: string;
  image_url?: string;
  category: string;
  category_model?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: string | string[] | null;
  url?: string;
  source?: string;
  view_count?: number;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Frontend Types
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
  slug:string
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount?: number;
  isActive?: boolean;
}

export interface ArticleFilters {
  category?: string;
  limit?: number;
  page?: number;
  perPage?: number;
  sortBy?: 'publishedAt' | 'title' | 'viewCount';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  clickUrl: string;
  placement: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface DataState<T> extends LoadingState {
  data: T | null;
}
