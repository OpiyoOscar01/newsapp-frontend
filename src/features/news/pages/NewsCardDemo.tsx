import React, { useState, useEffect } from 'react';
import CategorySection from '../components/widgets/CategorySection';
import { mockNewsData } from '../components/data/mockNews';
import { type CategoryData } from '../types/types';

const NewsCardDemo: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategories(mockNewsData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleArticleClick = (articleId: string) => {
    console.log('Article clicked:', articleId);
    // Here you would typically navigate to the article detail page
    // Example: navigate(`/article/${articleId}`);
  };

  const handleExploreMore = (categoryName: string) => {
    console.log('Explore more clicked for:', categoryName);
    // Here you would typically navigate to the category page
    // Example: navigate(`/category/${categoryName.toLowerCase()}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
    

     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Category Sections */}
        {categories.map((category) => (
          <CategorySection
            key={category.name}
            categoryData={category}
            onArticleClick={handleArticleClick}
            onExploreMore={handleExploreMore}
          />
        ))}

      </main>

      
    </div>
  );
};

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading latest news...</p>
    </div>
  </div>
);

export default NewsCardDemo;
