// src/components/SearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  showButton?: boolean;
  variant?: 'default' | 'expanded';
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = '',
  placeholder = 'Search articles...',
  className = '',
  showButton = false,
  variant = 'default',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isComposing) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim());
      }
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const clearSearch = () => {
    setQuery('');
    if (initialValue) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  const getInputClass = () => {
    const baseClass = "block w-full border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white";
    
    if (variant === 'expanded') {
      return `${baseClass} pl-12 pr-12 py-4 text-lg border-gray-300 shadow-sm`;
    }
    
    return `${baseClass} pl-10 pr-10 py-3 text-sm border-gray-300`;
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className={`text-gray-400 ${
              variant === 'expanded' ? 'w-6 h-6' : 'w-5 h-5'
            }`}
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
        </div>
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          className={getInputClass()}
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Button for Mobile */}
      {showButton && (
        <button
          type="submit"
          disabled={!query.trim()}
          className="mt-3 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Search Articles
        </button>
      )}

      {/* Quick Suggestions (Optional) */}
      {variant === 'expanded' && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-lg z-10 overflow-hidden">
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-2">Quick searches</div>
            <div className="space-y-1">
              {['Technology', 'Business', 'Sports', 'Health'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    onSearch(suggestion);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;