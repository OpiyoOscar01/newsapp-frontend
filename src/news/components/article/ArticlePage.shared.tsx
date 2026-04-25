import type {
  InteractionCounts,
  UserInteractions,
} from '../../api/article-interraction/ArticleInteractionTypes';

export type ArticleRecord = {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  imageUrl?: string;
  tags?: string[];
};

export type CommentCurrentUser = {
  id: number;
  name: string;
  email: string;
} | null;

export const EMPTY_COUNTS: InteractionCounts = {
  views: 0,
  likes: 0,
  shares: 0,
  bookmarks: 0,
  comments: 0,
};

export const EMPTY_USER_INTERACTIONS: UserInteractions = {
  liked: false,
  bookmarked: false,
};

export const convertToArticleRecord = (apiArticle: any): ArticleRecord => ({
  id: typeof apiArticle.id === 'string' ? parseInt(apiArticle.id, 10) : apiArticle.id,
  slug: apiArticle.slug || '',
  title: apiArticle.title || '',
  summary: apiArticle.summary || apiArticle.description || '',
  content: apiArticle.content || '',
  category: apiArticle.category || '',
  author: apiArticle.author || 'Unknown',
  publishedAt: apiArticle.published_at || apiArticle.publishedAt || new Date().toISOString(),
  readTime: apiArticle.readTime || Math.ceil((apiArticle.content?.length || 0) / 1000),
  imageUrl: apiArticle.image_url || apiArticle.imageUrl,
  tags: apiArticle.tags
    ? Array.isArray(apiArticle.tags)
      ? apiArticle.tags
      : typeof apiArticle.tags === 'string'
        ? (() => {
            try {
              return JSON.parse(apiArticle.tags);
            } catch {
              return [];
            }
          })()
        : []
    : [],
});

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    world: 'bg-red-100 text-red-800',
    business: 'bg-green-100 text-green-800',
    technology: 'bg-blue-100 text-blue-800',
    sports: 'bg-orange-100 text-orange-800',
    health: 'bg-purple-100 text-purple-800',
    science: 'bg-indigo-100 text-indigo-800',
    entertainment: 'bg-pink-100 text-pink-800',
    general: 'bg-gray-100 text-gray-800',
  };

  return colors[category] || colors.general;
};
