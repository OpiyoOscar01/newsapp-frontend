import React, { useState, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSearchComplete?: () => void; // NEW: Callback after search is triggered
  placeholder?: string;
  initialValue?: string;
  className?: string;
  showButton?: boolean; // NEW: Control button visibility
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSearchComplete,
  placeholder = 'Search...',
  initialValue = '',
  className = '',
  showButton = false
}) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      // Call the completion callback if provided
      if (onSearchComplete) {
        onSearchComplete();
      }
    }
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query.trim());
      // Call the completion callback if provided
      if (onSearchComplete) {
        onSearchComplete();
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          
          {query && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                onClick={handleClear}
                className="mr-3 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Visible Search Button - Shows on mobile when showButton is true */}
        {showButton && (
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex-shrink-0 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium text-sm md:px-6"
            aria-label="Search"
          >
            <span className="hidden sm:inline">Search</span>
            <svg 
              className="h-5 w-5 sm:hidden" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* Hidden submit button for form submission (Enter key) */}
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
