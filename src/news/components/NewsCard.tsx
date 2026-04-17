import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../types';
import { formatDate } from '../utils/formatDate';
import { ROUTES } from '../routes/routes';

interface NewsCardProps {
  article?: Article; // Made optional for skeleton state
  variant?: 'hero' | 'large' | 'medium' | 'standard' | 'compact' | 'mini' | 'small' | 'wide' | 'featured' | 'spotlight' | 'sidebar';
  orientation?: 'horizontal' | 'vertical';
  showImage?: boolean;
  className?: string;
  // Responsive props
  isFirstInCategory?: boolean;
  hideMetaMobile?: boolean;
  isFeaturedHero?: boolean;
  showCategory?: boolean;
  priority?: 'high' | 'normal';
  isLoading?: boolean; // New prop to control skeleton state
}

// Enhanced custom hook for lazy loading images with skeleton
const useLazyImage = (priority: 'high' | 'normal' = 'normal', isLoading?: boolean) => {
  const [isLoaded, setIsLoaded] = useState(priority === 'high' && !isLoading);
  const [isInView, setIsInView] = useState(priority === 'high' && !isLoading);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority === 'high' || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { 
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isLoading]);

  const handleLoad = () => {
    if (!isLoading) {
      setIsLoaded(true);
    }
  };

  return {
    containerRef,
    isLoaded: isLoading ? false : isLoaded,
    isInView: isLoading ? false : isInView,
    handleLoad,
    shouldLoad: isLoading ? false : (isInView || priority === 'high')
  };
};

// Skeleton component for text content
const TextSkeleton: React.FC<{
  lines?: number;
  variant?: 'title' | 'body' | 'meta';
  className?: string;
}> = ({ lines = 1, variant = 'body', className = '' }) => {
  const getHeight = () => {
    switch (variant) {
      case 'title': return 'h-4 md:h-6';
      case 'body': return 'h-3 md:h-4';
      case 'meta': return 'h-2.5 md:h-3';
      default: return 'h-3';
    }
  };

  const getWidth = () => {
    switch (variant) {
      case 'title': return 'w-3/4 md:w-4/5';
      case 'body': return 'w-full';
      case 'meta': return 'w-16 md:w-20';
      default: return 'w-full';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 animate-pulse rounded ${getHeight()} ${getWidth()} ${index === lines - 1 && variant === 'body' ? 'w-5/6' : ''}`}
        />
      ))}
    </div>
  );
};

// Category skeleton
const CategorySkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 animate-pulse rounded-full h-6 w-16 ${className}`} />
);

// Author/Date skeleton
const MetaSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="flex flex-wrap items-center gap-2">
    {Array.from({ length: items }).map((_, index) => (
      <React.Fragment key={index}>
        <div className="bg-gray-200 animate-pulse rounded h-2.5 w-12 md:w-16" />
        {index < items - 1 && <span className="text-gray-300">•</span>}
      </React.Fragment>
    ))}
  </div>
);

// Image skeleton component
const ImageSkeleton: React.FC<{
  className?: string;
  containerClass?: string;
  showCategory?: boolean;
}> = ({ className = '', containerClass = '', showCategory = true }) => (
  <div className={`relative overflow-hidden ${containerClass}`}>
    <div className={`bg-gray-200 animate-pulse ${className}`} />
    {showCategory && (
      <div className="absolute top-4 left-4">
        <CategorySkeleton />
      </div>
    )}
  </div>
);

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
  priority = 'normal',
  isLoading = false // Default to false
}) => {
  const { containerRef, isLoaded, handleLoad, shouldLoad } = useLazyImage(priority, isLoading);

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

  // Render image with lazy loading and skeleton
  const renderImage = (imageClass: string, containerClass?: string) => {
    if (!showImage) return null;

    if (isLoading) {
      return (
        <ImageSkeleton
          className={imageClass}
          containerClass={containerClass}
          showCategory={showCategory && variant !== 'compact'}
        />
      );
    }

    return (
      <div 
        ref={containerRef} 
        className={`relative overflow-hidden ${containerClass || ''}`}
      >
        {/* Image skeleton/placeholder */}
        {!isLoaded && (
          <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageClass}`} />
        )}
        
        {/* Actual image */}
        {shouldLoad && (
          <img
            src={article?.imageUrl}
            alt={article?.title}
            className={`
              ${imageClass}
              object-cover transform group-hover:scale-105 transition-transform duration-500
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            loading={priority === 'high' ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            decoding="async"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Category badge */}
        {showCategory && isLoaded && variant !== 'compact' && article && (
          <div className="absolute top-6 left-6">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-lg backdrop-blur-sm ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Common skeleton renderer for card content
  const renderSkeletonContent = (config: {
    titleLines?: number;
    bodyLines?: number;
    showBody?: boolean;
    showMeta?: boolean;
  }) => {
    const { titleLines = 2, bodyLines = 2, showBody = true, showMeta = true } = config;

    return (
      <>
        {showCategory && shouldHideMetaMobile && (
          <CategorySkeleton className="mb-2 md:hidden" />
        )}
        
        <TextSkeleton
          lines={titleLines}
          variant="title"
          className="mb-3"
        />
        
        {showBody && (
          <TextSkeleton
            lines={bodyLines}
            variant="body"
            className={`mb-4 ${shouldHideMetaMobile ? 'hidden md:block' : ''}`}
          />
        )}
        
        {showMeta && (
          <div className={`pt-3 border-t border-gray-100 mt-auto ${shouldHideMetaMobile ? 'hidden md:flex' : 'flex'}`}>
            <MetaSkeleton />
          </div>
        )}
      </>
    );
  };

  // If loading, render skeleton based on variant
  if (isLoading) {
    switch (variant) {
      case 'hero':
        return (
          <article className={`group bg-white rounded-2xl sm:rounded-t-none shadow-lg overflow-hidden ${isFeaturedHero ? 'featured-hero-card' : ''} ${className}`}>
            <div className="block">
              <ImageSkeleton
                className="w-full h-64 sm:h-80 md:h-96"
                containerClass={isFeaturedHero ? 'rounded-none sm:rounded-t-2xl' : ''}
                showCategory={showCategory}
              />
              <div className={`p-6 md:p-8 ${isFeaturedHero ? 'px-4 sm:px-6 md:px-8' : ''}`}>
                <TextSkeleton lines={2} variant="title" className="mb-4" />
                <TextSkeleton lines={3} variant="body" className="mb-6" />
                <MetaSkeleton items={4} />
              </div>
            </div>
          </article>
        );

      case 'large':
        return (
          <article className={cardClasses}>
            <div className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
              <ImageSkeleton className="w-full h-56 sm:h-64 md:h-80" />
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                {renderSkeletonContent({
                  titleLines: 3,
                  bodyLines: 3,
                  showBody: true
                })}
              </div>
            </div>
          </article>
        );

      case 'compact':
        return (
          <article className={cardClasses}>
            <div className="group bg-white rounded-lg shadow-sm overflow-hidden block h-full">
              <div className="flex items-stretch gap-3 p-3 md:block md:p-0">
                <div className="flex items-stretch md:block gap-3">
                  {showImage && (
                    <ImageSkeleton
                      className="w-[110px] h-[90px] md:w-full md:h-auto"
                      containerClass="rounded-lg md:rounded-t-lg md:rounded-b-none"
                      showCategory={false}
                    />
                  )}
                  <div className="flex-1 flex flex-col justify-between h-[90px] md:h-auto md:p-4 overflow-hidden">
                    <TextSkeleton lines={2} variant="title" className="mb-1" />
                    <div className="flex items-center gap-1.5 text-[10px] mt-auto">
                      <MetaSkeleton items={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );

      case 'wide':
        return (
          <article className={cardClasses}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
              {showImage && (
                <ImageSkeleton
                  className="w-full h-64 md:h-full md:min-h-[24rem]"
                  containerClass="md:w-1/2 flex-shrink-0"
                />
              )}
              <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center">
                <TextSkeleton lines={2} variant="title" className="mb-4" />
                <TextSkeleton lines={4} variant="body" className="mb-6" />
                <MetaSkeleton items={4} />
              </div>
            </div>
          </article>
        );

      case 'mini':
        return (
          <article className={cardClasses}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden block p-3">
              {showImage && (
                <ImageSkeleton
                  className="w-full h-32"
                  containerClass="rounded mb-3"
                />
              )}
              <TextSkeleton lines={2} variant="title" className="mb-2" />
              <MetaSkeleton items={2} />
            </div>
          </article>
        );

      case 'sidebar':
        return (
          <article className={cardClasses}>
            <div className="bg-white rounded-lg shadow-sm p-4 block">
              {showCategory && <CategorySkeleton className="mb-2" />}
              <TextSkeleton lines={3} variant="title" className="mb-2" />
              <MetaSkeleton items={2} />
            </div>
          </article>
        );

      case 'featured':
      case 'spotlight':
      case 'medium':
        return (
          <article className={cardClasses}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden block">
              <ImageSkeleton className="w-full h-64 md:h-80" />
              <div className="p-6">
                {renderSkeletonContent({
                  titleLines: 2,
                  bodyLines: 2,
                  showBody: true
                })}
              </div>
            </div>
          </article>
        );

      default: // standard
        return (
          <article className={cardClasses}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden block">
              <ImageSkeleton className="w-full h-48" />
              <div className="p-4">
                <TextSkeleton lines={3} variant="title" className="mb-2" />
                <MetaSkeleton items={3} />
              </div>
            </div>
          </article>
        );
    }
  }

  // Return null if no article provided
  if (!article) {
    console.warn('NewsCard component rendered without article data');
    return null;
  }

  // Hero Variant - Featured Story (Large and Prominent)
  if (variant === 'hero') {
    return (
      <article className={`group bg-white rounded-2xl sm:rounded-t-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${isFeaturedHero ? 'featured-hero-card' : ''} ${className}`}>
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="block cursor-pointer">
          {renderImage(
            "w-full h-64 sm:h-80 md:h-96",
            isFeaturedHero ? 'rounded-none sm:rounded-t-2xl' : ''
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
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="flex flex-col h-full group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
          {renderImage("w-full h-56 sm:h-64 md:h-80")}
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
          to={ROUTES.buildArticleRoute(article.slug)}
          className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden block h-full cursor-pointer"
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
                  ref={containerRef}
                  className={`
                    relative overflow-hidden flex-shrink-0 
                    w-[110px] h-[90px]
                    rounded-lg flex
                    md:block md:w-full md:h-auto md:rounded-t-lg md:rounded-b-none
                  `}
                >
                  {/* Image skeleton/placeholder */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  
                  {/* Actual image */}
                  {shouldLoad && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className={`
                        w-full h-full object-cover flex-1 self-stretch
                        transform group-hover:scale-105 transition-transform duration-500 ease-out
                        md:h-auto md:aspect-video
                        ${isLoaded ? 'opacity-100' : 'opacity-0'}
                      `}
                      loading={priority === 'high' ? 'eager' : 'lazy'}
                      onLoad={handleLoad}
                      decoding="async"
                    />
                  )}

                  {/* 🌫️ Overlay gradient for hover effect */}
                  <div
                    className="
                      absolute inset-0 bg-gradient-to-t from-black/30 to-transparent 
                      opacity-0 group-hover:opacity-60 transition-opacity duration-300
                    "
                  />

                  {/* 🏷️ Desktop category badge */}
                  {showCategory && isLoaded && (
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
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row cursor-pointer">
          {showImage && (
            <div ref={containerRef} className="relative overflow-hidden md:w-1/2 flex-shrink-0">
              {/* Image skeleton/placeholder */}
              {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse w-full h-64 md:h-full md:min-h-[24rem]" />
              )}
              
              {/* Actual image */}
              {shouldLoad && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className={`
                    w-full h-64 md:h-full md:min-h-[24rem] object-cover transform group-hover:scale-105 transition-transform duration-500
                    ${isLoaded ? 'opacity-100' : 'opacity-0'}
                  `}
                  loading={priority === 'high' ? 'eager' : 'lazy'}
                  onLoad={handleLoad}
                  decoding="async"
                />
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {showCategory && isLoaded && (
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
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden block p-3 cursor-pointer">
          {showImage && (
            <div ref={containerRef} className="relative overflow-hidden rounded mb-3">
              {/* Image skeleton/placeholder */}
              {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse w-full h-32" />
              )}
              
              {/* Actual image */}
              {shouldLoad && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className={`
                    w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300
                    ${isLoaded ? 'opacity-100' : 'opacity-0'}
                  `}
                  loading={priority === 'high' ? 'eager' : 'lazy'}
                  onLoad={handleLoad}
                  decoding="async"
                />
              )}
              
              {showCategory && isLoaded && (
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
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 block cursor-pointer">
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
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden block cursor-pointer">
          {renderImage("w-full h-64 md:h-80")}
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
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="group bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden block border border-gray-200 cursor-pointer">
          {renderImage("w-full h-56 md:h-72")}
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
        <Link to={ROUTES.buildArticleRoute(article.slug)} className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden block cursor-pointer">
          {renderImage("w-full h-48 md:h-64")}
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
      <Link to={ROUTES.buildArticleRoute(article.slug)} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden block cursor-pointer">
        {renderImage("w-full h-48")}
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