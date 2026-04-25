// src/pages/CategoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCategoryPage } from '../hooks/useCategoryPage';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import CompactNewsCard from '../components/CompactNewsCard';
import { CategoryPageSkeleton } from '../components/LoadingSkeletons';
import { ROUTES } from '../routes/routes';
import { useSubscribe } from '../api/newsletter/NewsletterQueries';
import { useAppSelector } from '../../shared/hooks/useRedux';
import { selectIsAuthenticated, selectUser } from '../../features/authentication/store/slices/authSlice';
import type { Article } from '../types';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
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

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterIsError, setNewsletterIsError] = useState(false);

  const { mutate: subscribe, isPending: newsletterLoading } = useSubscribe({
    onSuccess: (data) => {
      setNewsletterMessage(data.message);
      setNewsletterIsError(false);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
    onError: (error: any) => {
      setNewsletterMessage(error?.response?.data?.message || 'Subscription failed');
      setNewsletterIsError(true);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
  });

  // Set email for authenticated users
  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      setNewsletterEmail(currentUser.email);
    }
  }, [isAuthenticated, currentUser]);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    subscribe({ email: newsletterEmail.trim() });
  };

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
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
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
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto cursor-pointer"
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
                {paginatedData.items.map((article: Article) => (
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
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Matching ArticlePage Sidebar Style */}
        <aside className="lg:col-span-1">
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

            {/* Category Info Card - Similar to Article Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Category Info</h3>
              
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category Name</dt>
                  <dd className="mt-1 text-sm capitalize text-gray-900">
                    {category.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Articles</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {filteredAndSortedArticles.length} articles
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Browse All</dt>
                  <dd className="mt-1">
                    <Link
                      to={ROUTES.HOME}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View All Categories →
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Newsletter Signup Card - Matching ArticlePage Style */}
            <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Stay Updated</h3>
              <p className="mb-4 text-sm text-gray-600">
                Get the latest {category.name.toLowerCase()} news delivered to your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full cursor-text rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {newsletterMessage && (
                <p
                  className={`mt-3 text-center text-xs ${
                    newsletterIsError ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {newsletterMessage}
                </p>
              )}

              {isAuthenticated && currentUser?.email && (
                <p className="mt-3 text-xs text-gray-500">
                  Signed in as <span className="font-medium">{currentUser.email}</span>
                </p>
              )}
            </div>

            {/* Popular Tags Section - Optional Enhancement */}
            {category.tags && category.tags.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {category.tags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="inline-flex cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CategoryPage;