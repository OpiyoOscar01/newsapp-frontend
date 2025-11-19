import React from 'react';

export const ArticleCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="flex items-center space-x-4 mt-4">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export const ArticleGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ArticleCardSkeleton key={index} />
    ))}
  </div>
);

export const CategorySectionSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="w-20 h-1.5 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ArticleCardSkeleton />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);

export const ArticlePageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <article className="lg:col-span-3">
        <div className="mb-6 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        <div className="mb-8 h-96 bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </article>
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-8">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </aside>
    </div>
  </div>
);

export const CategoryPageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="w-16 h-1 bg-gray-200 rounded"></div>
        </div>
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="flex justify-between">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <ArticleGridSkeleton count={4} />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-8">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

export const LandingPageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
    <div className="mb-10 md:mb-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
    <div className="space-y-16">
      {Array.from({ length: 3 }).map((_, index) => (
        <CategorySectionSkeleton key={index} />
      ))}
    </div>
  </div>
);


/* -------------------------------
   DEFAULT EXPORT (FIXES ERROR)
--------------------------------*/
export default {
  ArticleCardSkeleton,
  ArticleGridSkeleton,
  CategorySectionSkeleton,
  ArticlePageSkeleton,
  CategoryPageSkeleton,
  LandingPageSkeleton,
};
