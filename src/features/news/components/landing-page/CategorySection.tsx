import React from 'react';
import { type Category } from '../../../../news/types';

interface CategorySectionProps {
  category: Category;
  articleCount: number;
  isLoading: boolean;
  children: React.ReactNode;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  articleCount,
  isLoading,
  children,
}) => (
  <section className="scroll-mt-20" data-category={category.slug}>
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize">
            {category.name}
          </h2>
          {!isLoading && (
            <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              {articleCount} articles
            </span>
          )}
        </div>
      </div>
      <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
      <div className="w-full mt-8">{children}</div>
    </div>
  </section>
);

export default CategorySection;