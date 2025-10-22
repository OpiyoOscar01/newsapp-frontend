import React from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../types';
import { formatDate } from '../utils/formatDate';

interface NewsCardProps {
  article: Article;
  variant?: 'hero' | 'large' | 'medium' | 'standard' | 'compact' | 'mini' | 'small' | 'wide' | 'featured' | 'spotlight' | 'sidebar';
  orientation?: 'horizontal' | 'vertical';
  showImage?: boolean;
  className?: string;
  // Responsive props
  isFirstInCategory?: boolean;  // First card - always show metadata
  hideMetaMobile?: boolean;     // Hide metadata on mobile for cards 2-4
  isFeaturedHero?: boolean;     // Edge-to-edge on mobile
  showCategory?: boolean;       // Show category badge (default behavior maintained)
  priority?: 'high' | 'normal'; // Loading priority
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = 'standard',
  orientation = 'vertical',
  showImage = true,
  className = '',
  isFirstInCategory = false,
  hideMetaMobile = false,
  isFeaturedHero = false,
  showCategory = true,
  priority = 'normal'
}) => {

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

  // Determine if metadata should be hidden on mobile
  const shouldHideMetaMobile = hideMetaMobile && !isFirstInCategory;

  // Build dynamic class names for responsive behavior
  const cardClasses = `
    news-card
    news-card-${variant}
    news-card-${orientation}
    ${isFirstInCategory ? 'is-first-in-category' : ''}
    ${hideMetaMobile ? 'hide-meta-mobile' : ''}
    ${isFeaturedHero ? 'featured-hero-card' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Hero Variant - Featured Story (Large and Prominent)
  if (variant === 'hero') {
    return (
      <article className={`group bg-white rounded-2xl sm:rounded-t-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${isFeaturedHero ? 'featured-hero-card' : ''} ${className}`}>
        <Link to={`/article/${article.id}`} className="block">
          {showImage && (
            <div className={`relative overflow-hidden ${isFeaturedHero ? 'rounded-none sm:rounded-t-2xl' : ''}`}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              {showCategory && (
                <div className="absolute top-6 left-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-lg backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className={`p-6 md:p-8 ${isFeaturedHero ? 'px-4 sm:px-6 md:px-8' : ''}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
              {article.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
              {article.summary}
            </p>
            <div className={`flex flex-wrap items-center gap-3 text-sm text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
              <span className="font-semibold text-gray-700">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{article.readTime} min read</span>
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Large Variant - Main Feature Card
  if (variant === 'large') {
    return (
      <article className={cardClasses}>
        <Link to={`/article/${article.id}`} className="flex flex-col h-full group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          {showImage && (
            <div className="relative overflow-hidden flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-56 sm:h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              {showCategory && (
                <div className="absolute top-4 left-4 hidden md:block">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize shadow-md backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="p-5 md:p-6 flex flex-col flex-grow news-card-content">
            {/* Mobile category badge - above title for cards 2-4 */}
            {showCategory && shouldHideMetaMobile && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 md:hidden self-start ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
            )}
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight line-clamp-4">
              {article.title}
            </h2>
            <p className={`text-sm sm:text-base md:text-lg text-gray-600 mb-4 flex-grow leading-relaxed ${shouldHideMetaMobile ? 'hidden md:block' : ''}`}>
              {article.summary}
            </p>
            <div className={`flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 pt-3 border-t border-gray-100 mt-auto ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
              <span className="font-medium text-gray-700">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{article.readTime} min</span>
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Compact Variant - PERFECTLY BALANCED horizontal layout for mobile cards 2-4
if (variant === 'compact') {
  return (
    <article className={cardClasses}>
      <Link
        to={`/article/${article.id}`}
        className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden block h-full"
      >
        <div
          className={`
            flex items-stretch gap-3 p-3 md:block md:p-0
            bg-white rounded-lg shadow-sm 
            hover:shadow-lg hover:-translate-y-1 
            transition-all duration-300 ease-out
            ${orientation === 'horizontal' && hideMetaMobile ? '' : 'gap-4 p-4'}
          `}
        >
          {/* 🔲 Outer wrapper ensures both image and content stretch evenly */}
          <div className="flex items-stretch md:block gap-3">

            {/* 🖼️ Image Container */}
            {showImage && (
              <div
                className={`
                  relative overflow-hidden flex-shrink-0 
                  w-[110px] h-[90px] /* ✅ Slightly wider than tall */
                  rounded-lg flex
                  md:block md:w-full md:h-auto md:rounded-t-lg md:rounded-b-none
                `}
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="
                    w-full h-full object-cover flex-1 self-stretch
                    transform group-hover:scale-105 transition-transform duration-500 ease-out
                    md:h-auto md:aspect-video
                  "
                  loading={priority === 'high' ? 'eager' : 'lazy'}
                />

                {/* 🌫️ Overlay gradient for hover effect */}
                <div
                  className="
                    absolute inset-0 bg-gradient-to-t from-black/30 to-transparent 
                    opacity-0 group-hover:opacity-60 transition-opacity duration-300
                  "
                />

                {/* 🏷️ Desktop category badge */}
                {showCategory && (
                  <div className="absolute top-2 left-2 hidden md:block">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 📰 Content Container */}
            <div
              className="
                flex-1 flex flex-col justify-between 
                h-[90px] /* ✅ Same height as image */
                overflow-hidden /* Prevent content overflow */
                md:h-auto md:p-4
              "
            >
              {/* 📱 Mobile category badge */}
              {showCategory && shouldHideMetaMobile && (
                <span
                  className={`
                    inline-flex items-center px-2.5 py-0.5 rounded 
                    text-[10px] font-bold uppercase tracking-wider 
                    mb-1.5 md:hidden self-start
                    ${getCategoryColor(article.category)}
                  `}
                >
                  {article.category}
                </span>
              )}

              {/* 🏷️ Title */}
              <h3
                className="
                  text-xs sm:text-sm font-semibold text-gray-900 
                  group-hover:text-primary-600 group-hover:underline 
                  transition-all duration-300
                  leading-snug mb-0.5
                "
              >
                {/* ✂️ Show only first 40 characters, add "..." if longer */}
                {article.title.length > 40
                  ? article.title.slice(0, 40) + '...'
                  : article.title}
              </h3>

              {/* ✍️ Author (small screens only) */}
              <p className="text-[11px] text-gray-500 mb-1 md:hidden">
                By {article.author}
              </p>

              {/* ⏱️ Metadata (visible on larger screens) */}
              <div
                className={`
                  flex flex-wrap items-center gap-1 text-[10px] text-gray-500 
                  mt-auto
                  ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}
                `}
              >
                <span className="font-medium">{article.author}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span>•</span>
                <span>{article.readTime} min</span>
              </div>

              {/* 📎 Read more (optional future addition) */}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}


  // Wide Variant - Horizontal Featured Card
  if (variant === 'wide') {
    return (
      <article className={cardClasses}>
        <Link to={`/article/${article.id}`} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
          {showImage && (
            <div className="relative overflow-hidden md:w-1/2 flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-full md:min-h-[24rem] object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              {showCategory && (
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold capitalize shadow-md backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
              {article.title}
            </h2>
            <p className={`text-base sm:text-lg md:text-xl text-gray-600 mb-6 leading-relaxed ${shouldHideMetaMobile ? 'hidden md:block' : ''}`}>
              {article.summary}
            </p>
            <div className={`flex flex-wrap items-center gap-3 text-sm text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
              <span className="font-semibold text-gray-700">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{article.readTime} min</span>
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Mini Variant - Compact Grid Item
  if (variant === 'mini') {
    return (
      <article className={cardClasses}>
        <Link to={`/article/${article.id}`} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden block p-3">
          {showImage && (
            <div className="relative overflow-hidden rounded mb-3">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              {showCategory && (
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-3 mb-2">
            {article.title}
          </h3>
          <div className={`flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime} min</span>
          </div>
        </Link>
      </article>
    );
  }

  // Sidebar Variant - Minimal Info
  if (variant === 'sidebar') {
    return (
      <article className={cardClasses}>
        <Link to={`/article/${article.id}`} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 block">
          {showCategory && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-2 ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          )}
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-3 mb-2">
            {article.title}
          </h3>
          <div className={`flex items-center gap-1.5 text-[10px] text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime} min</span>
          </div>
        </Link>
      </article>
    );
  }

  // Featured Variant
  if (variant === 'featured') {
    return (
      <article className={cardClasses}>
        <Link to={`/article/${article.id}`} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden block">
          {showImage && (
            <div className="relative overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              {showCategory && (
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold capitalize shadow-md backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight line-clamp-3">
              {article.title}
            </h2>
            <p className={`text-base text-gray-600 mb-4 leading-relaxed line-clamp-2 ${shouldHideMetaMobile ? 'hidden md:block' : ''}`}>
              {article.summary}
            </p>
            <div className={`flex flex-wrap items-center gap-2 text-sm text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
              <span className="font-medium text-gray-700">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readTime} min</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Spotlight Variant
  if (variant === 'spotlight') {
    return (
      <article className={cardClasses}>
        <Link to={`/article/${article.id}`} className="group bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden block border border-gray-200">
          {showImage && (
            <div className="relative overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-56 md:h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              {showCategory && (
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold capitalize shadow-md backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight">
              {article.title}
            </h2>
            <p className={`text-base text-gray-600 mb-4 leading-relaxed ${shouldHideMetaMobile ? 'hidden md:block' : ''}`}>
              {article.summary}
            </p>
            <div className={`flex flex-wrap items-center gap-2 text-sm text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
              <span className="font-medium text-gray-700">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readTime} min</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Medium Variant
  if (variant === 'medium') {
    return (
      <article className={cardClasses}>
        <Link to={`/article/${article.id}`} className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden block">
          {showImage && (
            <div className="relative overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 md:h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading={priority === 'high' ? 'eager' : 'lazy'}
              />
              {showCategory && (
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-md backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="p-5">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors leading-tight line-clamp-3">
              {article.title}
            </h2>
            <p className={`text-sm md:text-base text-gray-600 mb-3 leading-relaxed line-clamp-2 ${shouldHideMetaMobile ? 'hidden md:block' : ''}`}>
              {article.summary}
            </p>
            <div className={`flex flex-wrap items-center gap-2 text-xs text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
              <span className="font-medium">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readTime} min</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Standard Variant (Default)
  return (
    <article className={cardClasses}>
      <Link to={`/article/${article.id}`} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden block">
        {showImage && (
          <div className="relative overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
              loading={priority === 'high' ? 'eager' : 'lazy'}
            />
            {showCategory && (
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold capitalize backdrop-blur-sm ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-3">
            {article.title}
          </h3>
          <div className={`flex flex-wrap items-center gap-2 text-xs text-gray-500 ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
            <span>{article.author}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime} min</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;