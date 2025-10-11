import React from 'react';
import { type PaginationProps } from '../types';

/**
 * Pagination component for navigating through multiple pages
 * Features: Previous/Next buttons, page numbers, and responsive design
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, page: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePageChange(page);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className="flex items-center justify-center space-x-2 mt-8"
      aria-label="Pagination navigation"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
            : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-blue-200 focus:outline-none'
        }`}
        aria-label="Go to previous page"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400 select-none" aria-hidden="true">
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                onKeyDown={(e) => handleKeyDown(e, page as number)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-blue-200 focus:outline-none'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
            : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-blue-200 focus:outline-none'
        }`}
        aria-label="Go to next page"
      >
        Next
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;