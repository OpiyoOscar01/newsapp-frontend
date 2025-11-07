import React from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../types';
import { formatDate } from '../utils/formatDate';

interface CompactNewsCardProps {
  article: Article;
  // showCategory?: boolean;
  priority?: 'high' | 'normal';
  className?: string;
}

const CompactNewsCard: React.FC<CompactNewsCardProps> = ({
  article,
  // showCategory = true,
  priority = 'normal',
  className = ''
}) => {
  
  // const getCategoryColor = (category: string) => {
  //   const colors: { [key: string]: string } = {
  //     world: 'bg-red-100 text-red-800',
  //     business: 'bg-green-100 text-green-800',
  //     technology: 'bg-blue-100 text-blue-800',
  //     sports: 'bg-orange-100 text-orange-800',
  //     health: 'bg-purple-100 text-purple-800',
  //     science: 'bg-indigo-100 text-indigo-800'
  //   };
  //   return colors[category] || 'bg-gray-100 text-gray-800';
  // };

  return (
    <article className={`compact-news-card ${className}`}>
      <Link
        to={`/article/${article.id}`}
        className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden block"
      >
        <div className="flex items-stretch gap-3 p-3 h-full">
          
          {/* Left Side - Content Container */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug mb-2 line-clamp-3">
              {article.title}
            </h3>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 mt-auto">
              <span className="font-medium truncate max-w-[120px]">{article.author}</span>
              <span>•</span>
              <span className="whitespace-nowrap">{formatDate(article.publishedAt)}</span>
              <span>•</span>
              {/* <span className="whitespace-nowrap">{article.readTime} min</span> */}
            </div>
          </div>

          {/* Right Side - Image Container */}
          <div className="relative overflow-hidden flex-shrink-0 w-[110px] h-[90px] rounded-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
              loading={priority === 'high' ? 'eager' : 'lazy'}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CompactNewsCard;
