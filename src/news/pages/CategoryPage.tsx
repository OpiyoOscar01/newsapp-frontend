import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { categories, getArticlesByCategory } from '../data/mockData';
import { selectRandomAd, selectMultipleAds } from '../utils/randomAdSelector';
import { paginate } from '../utils/paginationHelpers';
import { filterArticlesBySearch, sortArticles } from '../utils/filterArticles';
import {type Ad,type Article } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import CompactNewsCard from '../components/CompactNewsCard';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [inlineAds, setInlineAds] = useState<Ad[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readTime'>('date');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('perPage') || '4'));

  // Get category information
  const category = categories.find(cat => cat.slug === categorySlug);
  
  // Get and filter articles
  const allCategoryArticles = categorySlug ? getArticlesByCategory(categorySlug) : [];
  
  const filteredAndSortedArticles = useMemo(() => {
    let articles = allCategoryArticles;
    
    // Apply search filter
    if (searchQuery.trim()) {
      articles = filterArticlesBySearch(articles, searchQuery);
    }
    
    // Apply sorting
    articles = sortArticles(articles, sortBy);
    
    return articles;
  }, [allCategoryArticles, searchQuery, sortBy]);

  // Paginate articles
  const paginatedData = useMemo(() => {
    return paginate(filteredAndSortedArticles, currentPage, itemsPerPage);
  }, [filteredAndSortedArticles, currentPage, itemsPerPage]);

  useEffect(() => {
    // Load ads for this category
    const sidebar = selectRandomAd(categorySlug || 'category', 'sidebar');
    const inline = selectMultipleAds(categorySlug || 'category', 2, 'inline');
    
    setSidebarAd(sidebar);
    setInlineAds(inline);
  }, [categorySlug]);

  useEffect(() => {
    // Update URL with search, page, and perPage parameters
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (currentPage > 1) newParams.set('page', currentPage.toString());
    if (itemsPerPage !== 4) newParams.set('perPage', itemsPerPage.toString());
    setSearchParams(newParams);
  }, [searchQuery, currentPage, itemsPerPage, setSearchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (newSortBy: 'date' | 'title' | 'readTime') => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Create articles with inline ads inserted
  const articlesWithAds = useMemo(() => {
    const items: (Article | Ad)[] = [];
    
    paginatedData.items.forEach((article, index) => {
      items.push(article);
      
      // Insert inline ad after every 3rd article
      if ((index + 1) % 3 === 0 && inlineAds[Math.floor(index / 3)]) {
        items.push(inlineAds[Math.floor(index / 3)]);
      }
    });
    
    return items;
  }, [paginatedData.items, inlineAds]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The requested category does not exist.</p>
          <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Category Header */}
          <div className="mb-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 mb-1">
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
              
              <div className="flex items-center space-x-4">
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
  {/* Items per page selector */}
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
          (currentPage - 1) * itemsPerPage + 1,
          filteredAndSortedArticles.length
        )}
        -
        {Math.min(
          currentPage * itemsPerPage,
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articlesWithAds.map((item, index) => {
                  if ('clickUrl' in item) {
                    // It's an ad
                    return (
                      <div key={`ad-${item.id}-${index}`} className="md:col-span-2">
                        <AdBanner ad={item} placement={categorySlug || 'category'} />
                      </div>
                    );
                  } else {
                    // It's an article
                    return (
                      <CompactNewsCard
                        key={item.id}
                        article={item}
                      />
                    );
                  }
                })}
              </div>

              {/* Pagination */}
              {paginatedData.totalPages > 1 && (
                <div className="mt-3">
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
          <div className="sticky top-24 space-y-8">
            {/* Sidebar Ad */}
            {sidebarAd && (
              <AdBanner ad={sidebarAd} placement={categorySlug || 'category'} />
            )}

            {/* Popular Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Categories</h3>
              <div className="space-y-2">
                {categories
                  .filter(cat => cat.slug !== categorySlug)
                  .slice(0, 5)
                  .map((cat) => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors capitalize"
                    >
                      {cat.name}
                    </a>
                  ))}
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