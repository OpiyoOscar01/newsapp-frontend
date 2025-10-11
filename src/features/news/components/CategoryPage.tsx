import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import Pagination from '../components/Pagination';
import { getCategoriesPaginated, getTotalCategoryPages} from './data/mockData.ts'
import { type Category } from '../types/index.ts'

/**
 * CategoryPage component displays paginated list of news categories
 * Features: Category grid, pagination, loading states, and navigation
 */
const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categoriesPerPage = 6;
  const totalPages = getTotalCategoryPages(categoriesPerPage);

  // Load categories when component mounts or page changes
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay for realistic loading experience
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const paginatedCategories = getCategoriesPaginated(currentPage, categoriesPerPage);
        setCategories(paginatedCategories);
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error('Error loading categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to articles page for this category (future implementation)
    // For now, we'll navigate to a placeholder article
    navigate(`/article/1`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore News Categories
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover the latest stories, insights, and breaking news across all your favorite topics
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of categories to find the news that matters most to you
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(categoriesPerPage)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-10 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onReadMore={handleCategoryClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {/* Stats Section */}
          {!isLoading && (
            <div className="mt-16 bg-white rounded-xl shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                  <div className="text-gray-600">News Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
                  <div className="text-gray-600">Articles Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">Daily</div>
                  <div className="text-gray-600">Content Updates</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;