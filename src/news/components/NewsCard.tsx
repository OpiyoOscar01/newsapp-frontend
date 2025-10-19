import React from 'react';
import { Link } from 'react-router-dom';
import {type Article } from '../types';
import { formatDate } from '../utils/formatDate';

interface NewsCardProps {
  article: Article;
  variant?: 'hero' | 'large' | 'medium' | 'standard' | 'compact' | 'mini' | 'small' | 'wide' | 'featured' | 'spotlight' | 'sidebar';
  orientation?: 'vertical' | 'horizontal';
  priority?: 'high' | 'normal';
  showImage?: boolean;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = 'standard',
  orientation = 'vertical',
  priority = 'normal',
  showImage = true,
  className = ''
}) => {

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      world: 'bg-red-500 text-white',
      business: 'bg-green-500 text-white',
      technology: 'bg-blue-500 text-white',
      sports: 'bg-orange-500 text-white',
      health: 'bg-purple-500 text-white',
      science: 'bg-indigo-500 text-white'
    };
    return colors[category] || 'bg-gray-500 text-white';
  };

  const ReadMoreButton = ({ inline = false }: { inline?: boolean }) => (
    <span className={`
      inline-flex items-center space-x-1.5 text-primary-600 font-semibold text-sm md:text-base
      group-hover:text-primary-700 transition-colors
      ${inline ? '' : 'mt-auto pt-3'}
    `}>
      <span>Read more</span>
      <svg 
        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  );

  // Hero Variant - Premium Featured Story
  if (variant === 'hero') {
    return (
      <article className={`group relative bg-white rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${className}`}>
        <Link to={`/article/${article.id}`} className="block">
          {showImage && (
            <div className="relative overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-72 sm:h-96 md:h-[28rem] lg:h-[32rem] object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-5 md:top-6 left-5 md:left-6">
                <span className={`inline-flex items-center px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold capitalize shadow-2xl backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 group-hover:text-primary-600 transition-colors leading-tight">
              {article.title}
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed line-clamp-3">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-500">
                <span className="font-semibold text-gray-700">{article.author}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center space-x-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{article.readTime} min read</span>
                </span>
              </div>
              
              <ReadMoreButton inline />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Large Variant - Main Feature Card
  if (variant === 'large') {
    return (
      <article className={`group bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col ${className}`}>
        <Link to={`/article/${article.id}`} className="flex flex-col h-full">
          {showImage && (
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-colors"></div>
              
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold capitalize shadow-lg ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-5 md:p-7 flex flex-col flex-grow">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-primary-600 transition-colors leading-tight">
              {article.title}
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed line-clamp-3 flex-grow">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-auto">
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
                <span className="font-medium text-gray-700">{article.author}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span className="text-gray-400">•</span>
                <span>{article.readTime} min</span>
              </div>
              
              <ReadMoreButton inline />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Wide Variant - Horizontal Premium Card
  if (variant === 'wide') {
    return (
      <article className={`group bg-white rounded-xl lg:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${className}`}>
        <Link to={`/article/${article.id}`} className="flex flex-col md:flex-row h-full">
          {showImage && (
            <div className="relative overflow-hidden md:w-1/2 flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-full md:min-h-[24rem] lg:min-h-[28rem] object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent group-hover:from-black/30 transition-colors"></div>
              
              <div className="absolute top-4 md:top-6 left-4 md:left-6">
                <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold capitalize shadow-lg ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8 lg:p-10 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 group-hover:text-primary-600 transition-colors leading-tight">
              {article.title}
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed line-clamp-4">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-500">
                <span className="font-semibold text-gray-700">{article.author}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span className="text-gray-400">•</span>
                <span>{article.readTime} min read</span>
              </div>
              
              <ReadMoreButton inline />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Compact Variant - Flexible Horizontal/Vertical
  if (variant === 'compact') {
    if (orientation === 'horizontal') {
      return (
        <article className={`group bg-white rounded-lg lg:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full ${className}`}>
          <Link to={`/article/${article.id}`} className="flex gap-4 p-4 md:p-5 h-full">
            {showImage && (
              <div className="flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0 flex flex-col">
              <span className={`inline-flex self-start items-center px-2.5 py-1 rounded-md text-xs font-bold capitalize mb-2 ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
              
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2 flex-grow">
                {article.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                <span className="font-medium">{article.author}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              
              <ReadMoreButton />
            </div>
          </Link>
        </article>
      );
    }
    
    // Vertical compact
    return (
      <article className={`group bg-white rounded-lg lg:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col ${className}`}>
        <Link to={`/article/${article.id}`} className="flex flex-col h-full">
          {showImage && (
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-44 sm:h-52 object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold capitalize ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-4 md:p-5 flex flex-col flex-grow">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2 flex-grow">
              {article.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="text-gray-400">•</span>
              <span>{article.readTime} min</span>
            </div>
            
            <ReadMoreButton />
          </div>
        </Link>
      </article>
    );
  }

  // Mini Variant - Small Grid Item
  if (variant === 'mini' || variant === 'small') {
    return (
      <article className={`group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col ${className}`}>
        <Link to={`/article/${article.id}`} className="flex flex-col h-full">
          {showImage && (
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-40 sm:h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold capitalize ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2 flex-grow">
              {article.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="text-gray-400">•</span>
              <span>{article.readTime} min</span>
            </div>
            
            <ReadMoreButton />
          </div>
        </Link>
      </article>
    );
  }

  // Spotlight Variant - Dramatic Feature
  if (variant === 'spotlight') {
    return (
      <article className={`group relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${className}`}>
        <Link to={`/article/${article.id}`} className="flex flex-col md:flex-row">
          {showImage && (
            <div className="relative overflow-hidden md:w-3/5 flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-72 sm:h-80 md:h-full md:min-h-[28rem] object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold capitalize shadow-2xl backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8 lg:p-12 md:w-2/5 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 group-hover:text-primary-600 transition-colors leading-tight">
              {article.title}
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed line-clamp-4">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-500">
                <span className="font-semibold text-gray-700">{article.author}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              
              <ReadMoreButton inline />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Sidebar Variant - Compact Magazine Style
  if (variant === 'sidebar') {
    return (
      <article className={`group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col ${className}`}>
        <Link to={`/article/${article.id}`} className="flex flex-col h-full">
          {showImage && (
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-40 sm:h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold capitalize ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2 flex-grow">
              {article.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="text-gray-400">•</span>
              <span>{article.readTime} min</span>
            </div>
            
            <ReadMoreButton />
          </div>
        </Link>
      </article>
    );
  }

  // Medium Variant
  if (variant === 'medium') {
    return (
      <article className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col ${className}`}>
        <Link to={`/article/${article.id}`} className="flex flex-col h-full">
          {showImage && (
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-52 sm:h-60 md:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-colors"></div>
              
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold capitalize shadow-md ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-5 md:p-6 flex flex-col flex-grow">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
              {article.title}
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
                <span className="font-medium text-gray-700">{article.author}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              
              <ReadMoreButton inline />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Standard/Featured Variant - Default Premium Card
  return (
    <article className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col ${className}`}>
      <Link to={`/article/${article.id}`} className="flex flex-col h-full">
        {showImage && (
          <div className="relative overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-52 sm:h-60 md:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-colors"></div>
            
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-bold capitalize shadow-md ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
            </div>
          </div>
        )}
        
        <div className="p-5 md:p-6 flex flex-col flex-grow">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
            {article.title}
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
            {article.summary}
          </p>
          
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
              <span className="font-medium text-gray-700">{article.author}</span>
              <span className="text-gray-400">•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span className="text-gray-400">•</span>
              <span>{article.readTime} min</span>
            </div>
            
            <ReadMoreButton inline />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;