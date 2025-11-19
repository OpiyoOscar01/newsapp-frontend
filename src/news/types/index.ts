export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  clickUrl: string;
  type: 'banner' | 'sidebar' | 'inline' | 'bottom';
  placement: string[];
  company: string;
  isActive: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SearchResult {
  articles: Article[];
  totalCount: number;
}
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount?: number; // Add article count for dynamic categories
}

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
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}