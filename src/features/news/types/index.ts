/**
 * Type definitions for the News Web App
 */

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  articleCount: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryId: string;
  imageUrl: string;
  publishedDate: string;
  author: {
    name: string;
    avatar?: string;
  };
  excerpt: string;
  content: string;
  readTime: number; // in minutes
  tags: string[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CategoryCardProps {
  category: Category;
  onReadMore: (categoryId: string) => void;
}

export interface NavbarProps {
  currentPath?: string;
}

export interface LayoutProps {
  children: React.ReactNode;
}