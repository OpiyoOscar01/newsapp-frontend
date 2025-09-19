import React from 'react';
import { type CategoryData } from '../../types/types';
import NewsCard from './NewsCard';

interface CategorySectionProps {
  categoryData: CategoryData;
  onArticleClick?: (articleId: string) => void;
  onExploreMore?: (categoryName: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryData,
  onArticleClick,
  onExploreMore,
}) => {
  const { name, articles } = categoryData;

  // Enhanced category color mapping with modern color palette
  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, {
      primary: string;
      secondary: string;
      accent: string;
      bg: string;
      text: string;
      border: string;
      hover: string;
      gradient: string;
      darkText: string;
    }> = {
      'Technology': {
        primary: '#2563eb',
        secondary: '#dbeafe',
        accent: '#93c5fd',
        bg: 'bg-blue-50/80',
        text: 'text-blue-700',
        border: 'border-blue-200/60',
        hover: 'hover:bg-blue-100/80',
        gradient: 'from-blue-600 to-indigo-600',
        darkText: 'text-blue-900'
      },
      'Sports': {
        primary: '#059669',
        secondary: '#d1fae5',
        accent: '#6ee7b7',
        bg: 'bg-emerald-50/80',
        text: 'text-emerald-700',
        border: 'border-emerald-200/60',
        hover: 'hover:bg-emerald-100/80',
        gradient: 'from-emerald-600 to-green-600',
        darkText: 'text-emerald-900'
      },
      'Politics': {
        primary: '#dc2626',
        secondary: '#fecaca',
        accent: '#fca5a5',
        bg: 'bg-red-50/80',
        text: 'text-red-700',
        border: 'border-red-200/60',
        hover: 'hover:bg-red-100/80',
        gradient: 'from-red-600 to-rose-600',
        darkText: 'text-red-900'
      },
      'Business': {
        primary: '#7c3aed',
        secondary: '#e9d5ff',
        accent: '#c4b5fd',
        bg: 'bg-purple-50/80',
        text: 'text-purple-700',
        border: 'border-purple-200/60',
        hover: 'hover:bg-purple-100/80',
        gradient: 'from-purple-600 to-violet-600',
        darkText: 'text-purple-900'
      },
      'Health': {
        primary: '#ec4899',
        secondary: '#fce7f3',
        accent: '#f9a8d4',
        bg: 'bg-pink-50/80',
        text: 'text-pink-700',
        border: 'border-pink-200/60',
        hover: 'hover:bg-pink-100/80',
        gradient: 'from-pink-600 to-rose-600',
        darkText: 'text-pink-900'
      },
      'Science': {
        primary: '#4f46e5',
        secondary: '#e0e7ff',
        accent: '#a5b4fc',
        bg: 'bg-indigo-50/80',
        text: 'text-indigo-700',
        border: 'border-indigo-200/60',
        hover: 'hover:bg-indigo-100/80',
        gradient: 'from-indigo-600 to-blue-600',
        darkText: 'text-indigo-900'
      },
      'Entertainment': {
        primary: '#f59e0b',
        secondary: '#fef3c7',
        accent: '#fcd34d',
        bg: 'bg-amber-50/80',
        text: 'text-amber-700',
        border: 'border-amber-200/60',
        hover: 'hover:bg-amber-100/80',
        gradient: 'from-amber-600 to-orange-600',
        darkText: 'text-amber-900'
      },
      'Weather': {
        primary: '#0ea5e9',
        secondary: '#e0f2fe',
        accent: '#7dd3fc',
        bg: 'bg-sky-50/80',
        text: 'text-sky-700',
        border: 'border-sky-200/60',
        hover: 'hover:bg-sky-100/80',
        gradient: 'from-sky-600 to-cyan-600',
        darkText: 'text-sky-900'
      },
      'Finance': {
        primary: '#10b981',
        secondary: '#d1fae5',
        accent: '#6ee7b7',
        bg: 'bg-emerald-50/80',
        text: 'text-emerald-700',
        border: 'border-emerald-200/60',
        hover: 'hover:bg-emerald-100/80',
        gradient: 'from-emerald-600 to-teal-600',
        darkText: 'text-emerald-900'
      },
    };
    
    return colors[categoryName] || {
      primary: '#6b7280',
      secondary: '#f9fafb',
      accent: '#d1d5db',
      bg: 'bg-gray-50/80',
      text: 'text-gray-700',
      border: 'border-gray-200/60',
      hover: 'hover:bg-gray-100/80',
      gradient: 'from-gray-600 to-slate-600',
      darkText: 'text-gray-900'
    };
  };

  const colorScheme = getCategoryColor(name);

  const handleExploreMore = () => {
    if (onExploreMore) {
      onExploreMore(name);
    }
  };

  return (
    <section 
      className="mb-8 sm:mb-12 lg:mb-16 xl:mb-20 scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-24" 
      aria-labelledby={`${name.toLowerCase()}-heading`}
      id={`category-${name.toLowerCase()}`}
    >
      {/* Enhanced Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8 lg:mb-10 gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Category indicator line */}
          <div 
            className="w-1 sm:w-1.5 lg:w-2 h-8 sm:h-10 lg:h-12 rounded-full shrink-0"
            style={{ backgroundColor: colorScheme.primary }}
          />
          
          <div className="min-w-0 flex-1">
            <h2 
              id={`${name.toLowerCase()}-heading`}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 leading-tight tracking-tight"
            >
              {name}
            </h2>
            
            {/* Subtitle with article count */}
            <div className="flex items-center gap-2 mt-1 sm:mt-2">
              <span className="text-sm sm:text-base text-gray-500 font-medium">
                {articles.length} {articles.length === 1 ? 'story' : 'stories'}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-sm sm:text-base text-gray-500 font-medium">
                Latest updates
              </span>
            </div>
          </div>
        </div>

        {/* Category badge - mobile friendly */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            className={`
              inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold
              ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}
              rounded-full border-2 backdrop-blur-sm shadow-sm
              transition-all duration-200 hover:shadow-md hover:scale-105
            `}
          >
            <div 
              className="w-2 h-2 rounded-full mr-2 animate-pulse"
              style={{ backgroundColor: colorScheme.primary }}
            />
            Live
          </div>
        </div>
      </div>

      {/* Responsive Articles Grid */}
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Mobile: Single column with enhanced cards */}
        <div className="block sm:hidden space-y-4">
          {articles.slice(0, 4).map((article, index) => (
            <div key={article.id} className="relative">
              <NewsCard
                {...article}
                layout="horizontal"
                priority={index === 0}
                onClick={() => onArticleClick?.(article.id)}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                maxDescriptionLength={120}
              />
            </div>
          ))}
        </div>

        {/* Tablet: Mixed layout */}
        <div className="hidden sm:block lg:hidden">
          {articles[0] && (
            <div className="mb-6">
              <NewsCard
                {...articles[0]}
                layout="horizontal"
                priority={true}
                onClick={() => onArticleClick?.(articles[0].id)}
                className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                maxDescriptionLength={180}
              />
            </div>
          )}
          
          {articles.length > 1 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {articles.slice(1, 5).map((article) => (
                <div key={article.id} className="h-full">
                  <NewsCard
                    {...article}
                    layout="vertical"
                    onClick={() => onArticleClick?.(article.id)}
                    className="h-full shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    maxDescriptionLength={100}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: Premium layout with hero + grid */}
        <div className="hidden lg:block">
          {articles[0] && (
            <div className="mb-8 xl:mb-10">
              <NewsCard
                {...articles[0]}
                layout="horizontal"
                priority={true}
                onClick={() => onArticleClick?.(articles[0].id)}
                className="shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 max-h-[400px] xl:max-h-[450px]"
                maxDescriptionLength={250}
              />
            </div>
          )}
          
          {articles.length > 1 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
              {articles.slice(1, 4).map((article) => (
                <div key={article.id} className="h-full">
                  <NewsCard
                    {...article}
                    layout="vertical"
                    onClick={() => onArticleClick?.(article.id)}
                    className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    maxDescriptionLength={120}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Additional articles row for larger screens */}
          {articles.length > 4 && (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6 mt-6 xl:mt-8">
              {articles.slice(4, 8).map((article) => (
                <div key={article.id} className="h-full">
                  <NewsCard
                    {...article}
                    layout="vertical"
                    onClick={() => onArticleClick?.(article.id)}
                    className="h-full shadow-md hover:shadow-lg transition-all duration-300"
                    maxDescriptionLength={80}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Explore More Button */}
      {articles.length > 0 && (
        <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
          <button
            onClick={handleExploreMore}
            className={`
              group relative inline-flex items-center gap-2 sm:gap-3 
              px-6 sm:px-8 lg:px-10 py-3 sm:py-4 
              text-sm sm:text-base lg:text-lg font-bold
              ${colorScheme.text} ${colorScheme.bg} 
              rounded-2xl sm:rounded-3xl border-2 ${colorScheme.border}
              transition-all duration-300 ease-out
              hover:shadow-xl hover:-translate-y-1 hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-opacity-20
              min-w-[200px] sm:min-w-[280px] justify-center
              backdrop-blur-sm overflow-hidden
            `}
            style={{ 
              '--tw-ring-color': colorScheme.primary + '33',
              background: `linear-gradient(135deg, ${colorScheme.secondary}, ${colorScheme.accent})`
            } as React.CSSProperties}
            aria-label={`View all ${name} articles`}
          >
            {/* Background gradient effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}15, ${colorScheme.primary}25)`
              }}
            />
            
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            
            <span className="relative font-black tracking-wide">
              Explore all {name}
            </span>
            
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>

            {/* Shine effect */}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      )}

      {/* Enhanced section separator */}
      <div className="mt-12 sm:mt-16 lg:mt-20 flex justify-center">
        <div className="relative">
          <div className="h-px w-24 sm:w-32 lg:w-48 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: colorScheme.primary }}
          />
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
