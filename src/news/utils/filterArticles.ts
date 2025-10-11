import {type  Article } from '../types';

export const filterArticlesByCategory = (
  articles: Article[],
  category: string
): Article[] => {
  if (!category || category === 'all') {
    return articles;
  }
  return articles.filter(article => article.category === category);
};

export const filterArticlesBySearch = (
  articles: Article[],
  searchQuery: string
): Article[] => {
  if (!searchQuery.trim()) {
    return articles;
  }

  const query = searchQuery.toLowerCase().trim();
  
  return articles.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(query);
    const summaryMatch = article.summary.toLowerCase().includes(query);
    const contentMatch = article.content.toLowerCase().includes(query);
    const authorMatch = article.author.toLowerCase().includes(query);
    const tagMatch = article.tags.some(tag => 
      tag.toLowerCase().includes(query)
    );
    
    return titleMatch || summaryMatch || contentMatch || authorMatch || tagMatch;
  });
};

export const sortArticles = (
  articles: Article[],
  sortBy: 'date' | 'title' | 'readTime' = 'date'
): Article[] => {
  const sorted = [...articles];
  
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'readTime':
      return sorted.sort((a, b) => a.readTime - b.readTime);
    default:
      return sorted;
  }
};

export const getUniqueCategories = (articles: Article[]): string[] => {
  const categories = articles.map(article => article.category);
  return Array.from(new Set(categories));
};

export const getPopularTags = (articles: Article[], limit: number = 10): string[] => {
  const tagCounts: { [key: string]: number } = {};
  
  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => tag);
};