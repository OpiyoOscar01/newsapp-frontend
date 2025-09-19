import React from 'react';
import {type CategoryData } from '../../types/types';
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

  // Get category color for the explore more button
  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'Technology': 'blue',
      'Sports': 'green',
      'Politics': 'red',
      'Business': 'purple',
      'Health': 'pink',
      'Science': 'indigo',
      'Entertainment': 'yellow',
      'Weather': 'sky',
      'Finance': 'emerald',
    };
    return colors[categoryName] || 'gray';
  };

  const colorScheme = getCategoryColor(name);

  const handleExploreMore = () => {
    if (onExploreMore) {
      onExploreMore(name);
    }
  };

  return (
    <section className="mb-12 lg:mb-16" aria-labelledby={`${name.toLowerCase()}-heading`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <h2 
          id={`${name.toLowerCase()}-heading`}
          className={`
            text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900
            border-l-4 border-${colorScheme}-600 pl-4
            flex items-center gap-3
          `}
        >
          <span>{name}</span>
          <span className={`
            inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full
            bg-${colorScheme}-100 text-${colorScheme}-800
          `}>
            {articles.length} articles
          </span>
        </h2>
        
        {/* Desktop Explore More Button */}
        <button
          onClick={handleExploreMore}
          className={`
            hidden lg:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
            text-${colorScheme}-700 bg-${colorScheme}-50 hover:bg-${colorScheme}-100
            rounded-lg transition-colors duration-200 group
            border border-${colorScheme}-200 hover:border-${colorScheme}-300
          `}
        >
          <span>View all {name}</span>
          <svg 
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Articles Grid */}
      <div className={`
        grid gap-6 mb-8
        grid-cols-1 
        md:grid-cols-2 
        xl:grid-cols-4
        auto-rows-fr
      `}>
        {articles.slice(0, 4).map((article, index) => (
          <div key={article.id} className="h-full">
            <NewsCard
              {...article}
              layout={index === 0 ? 'vertical' : 'auto'}
              priority={index === 0}
              onClick={() => onArticleClick?.(article.id)}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {/* Mobile Explore More Button */}
      <div className="lg:hidden">
        <button
          onClick={handleExploreMore}
          className={`
            w-full flex items-center justify-center gap-2 py-3 px-6
            text-${colorScheme}-700 bg-${colorScheme}-50 hover:bg-${colorScheme}-100
            rounded-xl transition-all duration-200 group font-medium
            border-2 border-${colorScheme}-200 hover:border-${colorScheme}-300
            hover:shadow-md
          `}
        >
          <span>Explore more in {name}</span>
          <svg 
            className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default CategorySection;
