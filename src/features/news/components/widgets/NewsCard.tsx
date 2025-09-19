import React, { useState } from 'react';

interface NewsCardProps {
  image_url?: string;
  title: string;
  description?: string;
  author?: string;
  source?: string;
  published_at: string;
  category?: string;
  layout?: 'vertical' | 'horizontal' | 'auto';
  className?: string;
  onClick?: () => void;
  priority?: boolean;
  showReadMore?: boolean;
  maxDescriptionLength?: number;
}

const NewsCard: React.FC<NewsCardProps> = ({
  image_url,
  title,
  description,
  author,
  source,
  published_at,
  category,
  layout = 'auto',
  className = '',
  onClick,
  priority = false,
  showReadMore = true,
  maxDescriptionLength = 150,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Enhanced date formatting with precise "ago" functionality
  const formatTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);
      
      // Handle future dates
      if (diffInSeconds < 0) return 'Just now';
      
      // Seconds ago
      if (diffInSeconds < 60) {
        return diffInSeconds <= 5 ? 'Just now' : `${diffInSeconds}s ago`;
      }
      
      // Minutes ago
      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      }
      
      // Hours ago
      if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      }
      
      // Days ago
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      // Weeks ago
      if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? '1w ago' : `${diffInWeeks}w ago`;
      }
      
      // Months ago
      if (diffInMonths < 12) {
        return diffInMonths === 1 ? '1mo ago' : `${diffInMonths}mo ago`;
      }
      
      // Years ago
      if (diffInYears === 1) return '1y ago';
      if (diffInYears < 3) return `${diffInYears}y ago`;
      
      // For very old dates, show formatted date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return 'Invalid date';
    }
  };

  // Handle description truncation and read more functionality
  const processDescription = (text?: string) => {
    if (!text) return { displayText: '', needsReadMore: false };
    
    if (text.length <= maxDescriptionLength) {
      return { displayText: text, needsReadMore: false };
    }
    
    if (isExpanded) {
      return { displayText: text, needsReadMore: true };
    }
    
    // Find the last complete word before the limit
    const truncated = text.substring(0, maxDescriptionLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    const cutoff = lastSpaceIndex > maxDescriptionLength * 0.8 ? lastSpaceIndex : maxDescriptionLength;
    
    return {
      displayText: text.substring(0, cutoff),
      needsReadMore: true
    };
  };

  const { displayText, needsReadMore } = processDescription(description);

  // Get category color scheme
  const getCategoryStyle = (categoryName?: string) => {
    const categories: Record<string, { bg: string; text: string; ring: string; hover: string }> = {
      'Technology': { bg: 'bg-blue-600', text: 'text-white', ring: 'ring-blue-200', hover: 'hover:bg-blue-700' },
      'Sports': { bg: 'bg-green-600', text: 'text-white', ring: 'ring-green-200', hover: 'hover:bg-green-700' },
      'Politics': { bg: 'bg-red-600', text: 'text-white', ring: 'ring-red-200', hover: 'hover:bg-red-700' },
      'Business': { bg: 'bg-purple-600', text: 'text-white', ring: 'ring-purple-200', hover: 'hover:bg-purple-700' },
      'Health': { bg: 'bg-pink-600', text: 'text-white', ring: 'ring-pink-200', hover: 'hover:bg-pink-700' },
      'Science': { bg: 'bg-indigo-600', text: 'text-white', ring: 'ring-indigo-200', hover: 'hover:bg-indigo-700' },
      'Entertainment': { bg: 'bg-yellow-600', text: 'text-white', ring: 'ring-yellow-200', hover: 'hover:bg-yellow-700' },
      'Weather': { bg: 'bg-sky-600', text: 'text-white', ring: 'ring-sky-200', hover: 'hover:bg-sky-700' },
      'Finance': { bg: 'bg-emerald-600', text: 'text-white', ring: 'ring-emerald-200', hover: 'hover:bg-emerald-700' },
      'Automotive': { bg: 'bg-orange-600', text: 'text-white', ring: 'ring-orange-200', hover: 'hover:bg-orange-700' },
    };
    
    return categories[categoryName || ''] || { 
      bg: 'bg-gray-600', 
      text: 'text-white', 
      ring: 'ring-gray-200', 
      hover: 'hover:bg-gray-700' 
    };
  };

  const categoryStyle = getCategoryStyle(category);

  // Responsive layout logic
  const getLayoutClasses = () => {
    if (layout === 'vertical') return 'flex flex-col';
    if (layout === 'horizontal') return 'flex flex-col lg:flex-row';
    return 'flex flex-col xl:flex-row';
  };

  const getImageClasses = () => {
    if (layout === 'vertical') return 'w-full';
    if (layout === 'horizontal') return 'w-full lg:w-2/5 lg:flex-shrink-0';
    return 'w-full xl:w-2/5 xl:flex-shrink-0';
  };

  const getContentClasses = () => {
    if (layout === 'vertical') return 'p-4 sm:p-6 flex flex-col justify-between flex-grow';
    if (layout === 'horizontal') return 'p-4 sm:p-6 lg:p-8 flex flex-col justify-between flex-grow';
    return 'p-4 sm:p-6 xl:p-8 flex flex-col justify-between flex-grow';
  };

  const containerClasses = `
    group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl 
    transition-all duration-300 ease-out overflow-hidden cursor-pointer
    border border-gray-100 hover:border-gray-200
    transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50
    ${getLayoutClasses()}
    ${className}
  `.trim();

  const imageContainerClasses = `
    ${getImageClasses()} 
    relative overflow-hidden bg-gray-100
  `;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking read more
    setIsExpanded(!isExpanded);
  };

  const handleReadMoreKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <article 
      className={containerClasses} 
      role="article"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Article: ${title}`}
    >
      {/* Category Badge */}
      {category && (
        <div className={`
          absolute top-3 left-3 z-20 sm:top-4 sm:left-4
          ${layout !== 'vertical' ? 'xl:relative xl:top-0 xl:left-0 xl:hidden' : ''}
        `}>
          <span className={`
            inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold 
            rounded-full shadow-sm backdrop-blur-sm ring-1 ring-inset
            ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.ring}
            transition-all duration-200 group-hover:scale-105 ${categoryStyle.hover}
          `}>
            {category}
          </span>
        </div>
      )}

      {/* Image Section */}
      {image_url && (
        <div className={imageContainerClasses}>
          <img
            src={image_url}
            alt={`Cover image for ${title}`}
            className={`
              w-full h-48 sm:h-56 object-cover 
              transition-transform duration-700 ease-out group-hover:scale-110
              ${layout !== 'vertical' ? 'xl:h-full xl:min-h-[240px]' : ''}
            `}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          {/* Gradient overlay for category readability */}
          {category && (
            <div className={`
              absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent
              ${layout !== 'vertical' ? 'xl:hidden' : ''}
            `} />
          )}
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content Section */}
      <div className={getContentClasses()}>
        {/* Category for horizontal layout on larger screens */}
        {category && layout !== 'vertical' && (
          <div className="hidden xl:flex mb-4">
            <span className={`
              inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full
              transition-colors duration-200
              ${categoryStyle.text === 'text-white' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : `${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.hover}`}
            `}>
              {category}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-grow min-h-0">
          {/* Title */}
          <h2 className="group/title mb-3 sm:mb-4">
            <span className={`
              block font-bold text-gray-900 leading-tight
              text-lg sm:text-xl lg:text-2xl
              line-clamp-2 sm:line-clamp-3
              group-hover:text-blue-700 transition-colors duration-300
              group-focus-within:text-blue-700
            `}>
              {title}
            </span>
          </h2>

          {/* Description with Read More */}
          {description && (
            <div className="mb-4 sm:mb-6">
              <p className={`
                text-gray-600 leading-relaxed
                text-sm sm:text-base lg:text-lg
                group-hover:text-gray-700 transition-colors duration-300
              `}>
                {displayText}
                {needsReadMore && !isExpanded && '...'}
              </p>
              
              {/* Read More/Less Button */}
              {showReadMore && needsReadMore && (
                <button
                  onClick={handleReadMoreClick}
                  onKeyDown={handleReadMoreKeyDown}
                  className={`
                    mt-2 text-sm font-medium text-blue-600 hover:text-blue-800
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded
                    transition-colors duration-200 inline-flex items-center gap-1
                  `}
                  aria-label={isExpanded ? 'Show less text' : 'Show more text'}
                >
                  {isExpanded ? (
                    <>
                      <span>Read less</span>
                      <svg className="w-3 h-3 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Read more</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Metadata */}
        <div className={`
          flex items-center justify-between pt-4 sm:pt-6 
          border-t border-gray-100 text-xs sm:text-sm
          flex-wrap gap-2 sm:gap-0
        `}>
          {/* Author and Source */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {author && (
              <span className="font-semibold text-gray-800 truncate">
                {author}
              </span>
            )}
            {author && source && (
              <span className="text-gray-400 flex-shrink-0" aria-hidden="true">•</span>
            )}
            {source && (
              <span className="text-gray-600 font-medium truncate">
                {source}
              </span>
            )}
          </div>
          
          {/* Published Date with enhanced "ago" */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <time 
              dateTime={published_at}
              className={`
                text-gray-500 font-medium
                group-hover:text-gray-600 transition-colors duration-300
              `}
              title={new Date(published_at).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            >
              {formatTimeAgo(published_at)}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
