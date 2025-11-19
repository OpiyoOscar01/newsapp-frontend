import React from 'react';
import { type Category } from '../types/news';

interface CategoryNavigationProps {
  categories: Category[];
  currentCategoryIndex: number;
  onCategoryChange: (index: number) => void;
  className?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  currentCategoryIndex,
  onCategoryChange,
  className = ''
}) => {
  if (categories.length <= 1) return null;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-1 bg-gray-100 rounded-2xl p-1">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(index)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentCategoryIndex === index
                ? 'bg-white text-primary-600 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;