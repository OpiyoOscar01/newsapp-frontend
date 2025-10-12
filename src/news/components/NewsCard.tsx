import React from 'react';
import { Link } from 'react-router-dom';
import {type Article } from '../types';
import { formatDate } from '../utils/formatDate';

interface NewsCardProps {
  article: Article;
  size?: 'small' | 'medium' | 'large';
  showImage?: boolean;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  size = 'medium',
  showImage = true,
  className = ''
}) => {
  // const getSizeClasses = () => {
  //   switch (size) {
  //     case 'small':
  //       return 'h-24';
  //     case 'large':
  //       return 'h-80 md:h-96';
  //     default:
  //       return 'h-48 md:h-64';
  //   }
  // };

  const getImageSize = () => {
    switch (size) {
      case 'small':
        return 'w-20 h-20';
      case 'large':
        return 'w-full h-48 md:h-56';
      default:
        return 'w-full h-32 md:h-40';
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm font-medium';
      case 'large':
        return 'text-xl md:text-2xl font-bold';
      default:
        return 'text-lg font-semibold';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      world: 'bg-red-100 text-red-800',
      business: 'bg-green-100 text-green-800',
      technology: 'bg-blue-100 text-blue-800',
      sports: 'bg-orange-100 text-orange-800',
      health: 'bg-purple-100 text-purple-800',
      science: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (size === 'small') {
    return (
      <article className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
        <Link to={`/article/${article.id}`} className="block p-4">
          <div className="flex space-x-3">
            {showImage && (
              <div className="flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className={`${getImageSize()} object-cover rounded`}
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
              <h3 className={`${getTitleSize()} text-gray-900 line-clamp-2 mb-1`}>
                {article.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span>{article.author}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${className}`}
>
  <Link to={`/article/${article.id}`} className="block">
    {showImage && (
      <div className="relative">
        <img
          src={article.imageUrl}
          alt={article.title}
          className={`${getImageSize()} object-cover w-full`}
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getCategoryColor(
              article.category
            )}`}
          >
            {article.category}
          </span>
        </div>
      </div>
    )}

    <div className="p-4 md:p-6">
      <h2
        className={`${getTitleSize()} text-gray-900 line-clamp-2 mb-2 hover:text-primary-600 transition-colors`}
      >
        {article.title}
      </h2>

      <p className="text-gray-600 text-sm md:text-base line-clamp-3 mb-4">
        {article.summary}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{article.author}</span>
          <span>•</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <span className="flex items-center space-x-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{article.readTime} min</span>
        </span>
      </div>

      {/* Read More (not a link) */}
      <div className="text-blue-600 font-medium hover:underline cursor-default select-none cursor-pointer">
        Read more →
      </div>
    </div>
  </Link>
</article>

  );
};

export default NewsCard;