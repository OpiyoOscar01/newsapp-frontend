export interface NewsCardProps {
  image_url?: string;
  title: string;
  description?: string;
  author?: string;
  source?: string;
  published_at: string;
  category?: string;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}
export interface NewsItem {
  id: string;
  image_url?: string;
  title: string;
  description?: string;
  author?: string;
  source?: string;
  published_at: string;
  category?: string;
  url?: string;
}

export interface CategoryData {
  name: string;
  articles: NewsItem[];
  color?: string;
}