import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryPage } from '../hooks/useCategoryPage';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import CompactNewsCard from '../components/CompactNewsCard';
import { CategoryPageSkeleton } from '../components/LoadingSkeletons';
import { type Article } from '../types'; // Make sure to import the Article type

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    category,
    loading,
    error,
    searchQuery,
    sortBy,
    itemsPerPage,
    topBannerAd,
    sidebarAd,
    filteredAndSortedArticles,
    paginatedData,
    handleSearch,
    handleSortChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleRetry,
  } = useCategoryPage();

  if (loading) {
    return <CategoryPageSkeleton />;
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested category does not exist.'}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* Ad 1: Top Banner Ad */}
      {topBannerAd && (
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-2 border border-gray-200 shadow-sm">
            <AdBanner 
              ad={topBannerAd} 
              placement="banner"
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Category Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 capitalize">
              {category.name}
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              {category.description}
            </p>
            <div className="w-16 h-1 bg-primary-600 rounded"></div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <SearchBar
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                  placeholder={`Search in ${category.name}...`}
                />
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-4">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as 'date' | 'title' | 'readTime')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="date">Latest</option>
                  <option value="title">Title A-Z</option>
                  <option value="readTime">Read Time</option>
                </select>
              </div>
            </div>

            {/* Items per page selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <label
                  htmlFor="items-per-page"
                  className="text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Articles per page:
                </label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto"
                >
                  <option value="4">4 articles</option>
                  <option value="8">8 articles</option>
                  <option value="12">12 articles</option>
                  <option value="20">20 articles</option>
                </select>
              </div>

              {/* Results count indicator */}
              <div className="text-sm text-gray-600 text-center sm:text-right">
                {filteredAndSortedArticles.length > 0 && (
                  <span>
                    Showing{" "}
                    {Math.min(
                      (paginatedData.currentPage - 1) * itemsPerPage + 1,
                      filteredAndSortedArticles.length
                    )}
                    -
                    {Math.min(
                      paginatedData.currentPage * itemsPerPage,
                      filteredAndSortedArticles.length
                    )}{" "}
                    of{" "}
                    <span className="font-semibold">
                      {filteredAndSortedArticles.length}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              {searchQuery ? (
                <>
                  Found <span className="font-semibold">{filteredAndSortedArticles.length}</span> articles 
                  for "<span className="font-semibold">{searchQuery}</span>" in {category.name}
                </>
              ) : (
                <>
                  <span className="font-semibold">{filteredAndSortedArticles.length}</span> total articles 
                  in {category.name}
                </>
              )}
            </p>
          </div>

          {/* Articles */}
          {paginatedData.items.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {paginatedData.items.map((article: Article) => ( // Explicitly type the article parameter
                  <div key={article.id}>
                    {/* Mobile version */}
                    <div className="md:hidden">
                      <CompactNewsCard 
                        article={article}
                      />
                    </div>

                    {/* Desktop version */}
                    <div className="hidden md:block">
                      <NewsCard
                        article={article}
                        variant="compact"
                        showImage={true}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {paginatedData.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={paginatedData.currentPage}
                    totalPages={paginatedData.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No articles match your search "${searchQuery}" in ${category.name}.`
                  : `No articles available in ${category.name} at the moment.`
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 lg:space-y-8">
            {/* Ad 2: Sidebar Ad */}
            {sidebarAd && (
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-200 shadow-sm">
                <AdBanner 
                  ad={sidebarAd} 
                  placement="sidebar"
                  className="w-full"
                />
              </div>
            )}

            {/* Popular Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                >
                  Browse All Categories
                </button>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest {category.name.toLowerCase()} news delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;