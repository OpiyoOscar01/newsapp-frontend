import React from 'react';
import { type Article } from '../types';
import NewsCard from './NewsCard';

interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
  className?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
  title = 'Related Articles',
  className = ''
}) => {
  if (articles.length === 0) return null;

  return (
    <section className={`${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <div className="w-12 h-1 bg-primary-600 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            size="medium"
            showImage={true}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;