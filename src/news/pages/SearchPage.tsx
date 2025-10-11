import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchArticles, categories } from '../data/mockData';
import { selectRandomAd } from '../utils/randomAdSelector';
import { paginate } from '../utils/paginationHelpers';
import { sortArticles } from '../utils/filterArticles';
import {type Ad } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readTime'>('date');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  
  const itemsPerPage = 8;

  // Search and filter articles
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    let results = searchArticles(searchQuery);
    
    // Filter by category if selected
    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter(article => article.category === selectedCategory);
    }
    
    // Apply sorting
    results = sortArticles(results, sortBy);
    
    return results;
  }, [searchQuery, selectedCategory, sortBy]);

  // Paginate results
  const paginatedData = useMemo(() => {
    return paginate(searchResults, currentPage, itemsPerPage);
  }, [searchResults, currentPage, itemsPerPage]);

  useEffect(() => {
    // Load sidebar ad
    const sidebar = selectRandomAd('category', 'sidebar');
    setSidebarAd(sidebar);
  }, []);

  useEffect(() => {
    // Update URL with search parameters
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('q', searchQuery);
    if (currentPage > 1) newParams.set('page', currentPage.toString());
    if (selectedCategory && selectedCategory !== 'all') newParams.set('category', selectedCategory);
    setSearchParams(newParams);
  }, [searchQuery, currentPage, selectedCategory, setSearchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: 'date' | 'title' | 'readTime') => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCurrentPage(1);
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Search Results
            </h1>
            {searchQuery && (
              <p className="text-lg text-gray-600 mb-6">
                Results for "<span className="font-semibold">{searchQuery}</span>"
                {selectedCategory && selectedCategory !== 'all' && (
                  <> in <span className="font-semibold capitalize">{selectedCategory}</span></>
                )}
              </p>
            )}
            <div className="w-16 h-1 bg-primary-600 rounded"></div>
          </div>

          {/* Search Controls */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div>
                <SearchBar
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                  placeholder="Search articles, authors, topics..."
                  className="w-full"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                    Category:
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug} className="capitalize">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
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
            </div>
          </div>

          {/* Results */}
          {searchQuery ? (
            searchResults.length > 0 ? (
              <div className="space-y-8">
                {/* Results Count */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold">{searchResults.length}</span> article{searchResults.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear search
                  </button>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedData.items.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      size="medium"
                      showImage={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {paginatedData.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={paginatedData.currentPage}
                      totalPages={paginatedData.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  No articles match your search "{searchQuery}"
                  {selectedCategory && selectedCategory !== 'all' && (
                    <> in {selectedCategory}</>
                  )}.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Try:</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Using different keywords</li>
                    <li>• Checking your spelling</li>
                    <li>• Removing category filter</li>
                    <li>• Using more general terms</li>
                  </ul>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="mt-6 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Browse all articles
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
              <p className="text-gray-600 mb-4">
                Enter keywords to find articles on topics you're interested in.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Sidebar Ad */}
            {sidebarAd && (
              <AdBanner ad={sidebarAd} placement="category" />
            )}

            {/* Popular Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors capitalize ${
                      selectedCategory === category.slug
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use specific keywords for better results</li>
                <li>• Try searching for author names</li>
                <li>• Search within specific categories</li>
                <li>• Use quotes for exact phrases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;