import React, { useState, useRef, useEffect } from 'react';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  // Intersection Observer for lazy loading and animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced date formatting with better internationalization
  const formatTimeAgo = (dateString: string): { display: string; full: string } => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      
      let display: string;
      
      if (diffInSeconds < 0) display = 'Just now';
      else if (diffInSeconds < 60) display = diffInSeconds <= 10 ? 'Just now' : `${diffInSeconds}s`;
      else if (diffInMinutes < 60) display = `${diffInMinutes}m`;
      else if (diffInHours < 24) display = `${diffInHours}h`;
      else if (diffInDays === 1) display = '1d';
      else if (diffInDays < 7) display = `${diffInDays}d`;
      else if (diffInDays < 30) display = `${Math.floor(diffInDays / 7)}w`;
      else display = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const full = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return { display, full };
    } catch (error) {
      return { display: 'Invalid date', full: 'Invalid date' };
    }
  };

  // Smart text truncation with better word boundaries
  const processDescription = (text?: string) => {
    if (!text) return { displayText: '', needsReadMore: false };
    
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxDescriptionLength) {
      return { displayText: cleanText, needsReadMore: false };
    }
    
    if (isExpanded) {
      return { displayText: cleanText, needsReadMore: true };
    }
    
    // Find good breaking point (sentence end, then word boundary)
    let cutoff = maxDescriptionLength;
    const sentenceEnd = cleanText.substring(0, maxDescriptionLength).lastIndexOf('. ');
    
    if (sentenceEnd > maxDescriptionLength * 0.6) {
      cutoff = sentenceEnd + 1;
    } else {
      const lastSpace = cleanText.substring(0, maxDescriptionLength).lastIndexOf(' ');
      if (lastSpace > maxDescriptionLength * 0.7) {
        cutoff = lastSpace;
      }
    }
    
    return {
      displayText: cleanText.substring(0, cutoff),
      needsReadMore: true
    };
  };

  const { displayText, needsReadMore } = processDescription(description);
  const timeInfo = formatTimeAgo(published_at);

  // Enhanced category styling with better accessibility
  const getCategoryStyle = (categoryName?: string) => {
    const categories: Record<string, { 
      bg: string; 
      text: string; 
      border: string;
      gradient: string;
      shadow: string;
    }> = {
      'Technology': { 
        bg: 'bg-blue-600', 
        text: 'text-white', 
        border: 'border-blue-500',
        gradient: 'from-blue-600 via-blue-700 to-indigo-600',
        shadow: 'shadow-blue-500/25'
      },
      'Sports': { 
        bg: 'bg-emerald-600', 
        text: 'text-white', 
        border: 'border-emerald-500',
        gradient: 'from-emerald-600 via-emerald-700 to-green-600',
        shadow: 'shadow-emerald-500/25'
      },
      'Politics': { 
        bg: 'bg-red-600', 
        text: 'text-white', 
        border: 'border-red-500',
        gradient: 'from-red-600 via-red-700 to-rose-600',
        shadow: 'shadow-red-500/25'
      },
      'Business': { 
        bg: 'bg-purple-600', 
        text: 'text-white', 
        border: 'border-purple-500',
        gradient: 'from-purple-600 via-purple-700 to-violet-600',
        shadow: 'shadow-purple-500/25'
      },
      'Health': { 
        bg: 'bg-pink-600', 
        text: 'text-white', 
        border: 'border-pink-500',
        gradient: 'from-pink-600 via-pink-700 to-rose-600',
        shadow: 'shadow-pink-500/25'
      },
      'Science': { 
        bg: 'bg-indigo-600', 
        text: 'text-white', 
        border: 'border-indigo-500',
        gradient: 'from-indigo-600 via-indigo-700 to-blue-600',
        shadow: 'shadow-indigo-500/25'
      },
      'Entertainment': { 
        bg: 'bg-amber-600', 
        text: 'text-white', 
        border: 'border-amber-500',
        gradient: 'from-amber-600 via-amber-700 to-orange-600',
        shadow: 'shadow-amber-500/25'
      },
      'Weather': { 
        bg: 'bg-sky-600', 
        text: 'text-white', 
        border: 'border-sky-500',
        gradient: 'from-sky-600 via-sky-700 to-cyan-600',
        shadow: 'shadow-sky-500/25'
      },
      'Finance': { 
        bg: 'bg-emerald-600', 
        text: 'text-white', 
        border: 'border-emerald-500',
        gradient: 'from-emerald-600 via-emerald-700 to-teal-600',
        shadow: 'shadow-emerald-500/25'
      },
    };
    
    return categories[categoryName || ''] || { 
      bg: 'bg-gray-600', 
      text: 'text-white', 
      border: 'border-gray-500',
      gradient: 'from-gray-600 via-gray-700 to-slate-600',
      shadow: 'shadow-gray-500/25'
    };
  };

  const categoryStyle = getCategoryStyle(category);

  // Responsive layout detection
  const isHorizontal = layout === 'horizontal';
  
  // Enhanced responsive classes
  const containerClasses = `
    group relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl 
    shadow-md hover:shadow-2xl border border-gray-100 hover:border-gray-200
    transition-all duration-500 ease-out cursor-pointer overflow-hidden
    transform hover:-translate-y-1 sm:hover:-translate-y-2
    focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-300
    backdrop-blur-sm
    ${isHorizontal 
      ? 'flex flex-col sm:flex-row min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]' 
      : 'flex flex-col h-full min-h-[320px] sm:min-h-[380px]'
    }
    ${isInView ? 'animate-in slide-in-from-bottom-8 fade-in duration-700' : 'opacity-0'}
    ${className}
  `.trim();

  const imageContainerClasses = `
    ${isHorizontal 
      ? 'w-full sm:w-2/5 lg:w-1/2 sm:flex-shrink-0' 
      : 'w-full'
    } 
    relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200
    ${isHorizontal 
      ? 'h-48 sm:h-full' 
      : 'h-48 sm:h-56 lg:h-64'
    }
  `;

  const contentClasses = `
    ${isHorizontal 
      ? 'p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col justify-between flex-grow' 
      : 'p-4 sm:p-5 lg:p-6 flex flex-col justify-between flex-grow'
    }
  `;

  const handleClick = () => onClick?.();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <article 
      ref={cardRef}
      className={containerClasses} 
      role="article"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Article: ${title}`}
    >
      {/* Enhanced Image Section */}
      {image_url && !imageError && (
        <div className={imageContainerClasses}>
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Animated loading skeleton */}
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          {/* Main image */}
          <img
            src={image_url}
            alt={`Cover image for ${title}`}
            className={`
              w-full h-full object-cover 
              transition-all duration-700 ease-out 
              group-hover:scale-110 group-hover:brightness-105
              ${!imageLoaded ? 'opacity-0' : 'opacity-100'}
            `}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            sizes={isHorizontal ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          />

          {/* Category badge with enhanced styling */}
          {category && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
              <span className={`
                inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 
                text-xs sm:text-sm font-black uppercase tracking-wider
                rounded-full shadow-lg backdrop-blur-md ring-2 ring-white/30
                bg-gradient-to-r ${categoryStyle.gradient} ${categoryStyle.text} ${categoryStyle.shadow}
                transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl
                group-hover:ring-white/50
              `}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full mr-1.5 sm:mr-2 animate-pulse" />
                {category}
              </span>
            </div>
          )}

          {/* Progressive gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Breaking news indicator for recent articles */}
          {(() => {
            const hoursAgo = Math.floor((Date.now() - new Date(published_at).getTime()) / (1000 * 60 * 60));
            return hoursAgo < 2 ? (
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
                <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-md animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  LIVE
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Fallback for missing/broken images */}
      {(!image_url || imageError) && (
        <div className={imageContainerClasses}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center p-4 sm:p-6">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-7 9l3-3 2.5 2.5L21 7" />
              </svg>
              {category && (
                <span className={`
                  inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider
                  rounded-full ${categoryStyle.bg} ${categoryStyle.text}
                `}>
                  {category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Content Section */}
      <div className={contentClasses}>
        {/* Main Content */}
        <div className="flex-grow space-y-3 sm:space-y-4">
          {/* Title with enhanced responsive typography */}
          <h2 className="group-hover:text-blue-700 group-focus-within:text-blue-700 transition-colors duration-300">
            <span className={`
              block font-black text-gray-900 leading-tight tracking-tight
              ${isHorizontal 
                ? 'text-lg sm:text-xl lg:text-2xl xl:text-3xl line-clamp-2 lg:line-clamp-3' 
                : 'text-base sm:text-lg lg:text-xl line-clamp-2 sm:line-clamp-3'
              }
              hover:line-clamp-none focus:line-clamp-none
            `}>
              {title}
            </span>
          </h2>

          {/* Enhanced Description with better typography */}
          {description && (
            <div className="space-y-2 sm:space-y-3">
              <p className={`
                text-gray-600 leading-relaxed group-hover:text-gray-700 
                transition-colors duration-300 font-medium
                ${isHorizontal 
                  ? 'text-sm sm:text-base lg:text-lg' 
                  : 'text-sm lg:text-base'
                }
              `}>
                {displayText}
                {needsReadMore && !isExpanded && '...'}
              </p>
              
              {/* Enhanced Read More/Less Button */}
              {showReadMore && needsReadMore && (
                <button
                  onClick={handleReadMoreClick}
                  className="group/btn inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-blue-50 active:scale-95"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Show less content' : 'Show more content'}
                >
                  <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                  <svg 
                    className={`
                      w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200
                      ${isExpanded ? 'rotate-180' : ''}
                      group-hover/btn:scale-110
                    `} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Footer Metadata */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 lg:pt-6 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
          {/* Author and Source with enhanced styling */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {author && (
              <span className="font-bold text-gray-800 group-hover:text-gray-900 truncate text-xs sm:text-sm lg:text-base transition-colors duration-300">
                {author}
              </span>
            )}
            {author && source && (
              <span className="text-gray-300 flex-shrink-0 text-sm">•</span>
            )}
            {source && (
              <span className="text-gray-600 group-hover:text-gray-700 font-semibold truncate text-xs sm:text-sm lg:text-base transition-colors duration-300">
                {source}
              </span>
            )}
          </div>
          
          {/* Enhanced Published Date with tooltip */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <time 
              dateTime={published_at}
              className="text-gray-500 group-hover:text-gray-600 font-bold transition-colors duration-300 text-xs sm:text-sm lg:text-base"
              title={timeInfo.full}
            >
              {timeInfo.display}
            </time>
          </div>
        </div>
      </div>

      {/* Enhanced interaction feedback */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Focus ring enhancement */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl ring-2 ring-transparent group-focus-within:ring-blue-500/50 transition-all duration-300 pointer-events-none" />
    </article>
  );
};

export default NewsCard;
