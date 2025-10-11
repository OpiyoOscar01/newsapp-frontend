import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type NavbarProps } from '../types';

/**
 * Navigation bar component with responsive design
 * Features: Logo, navigation links, mobile menu, and search functionality
 */
const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Definepress</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/') || isActive('/categories')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/categories"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/categories')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Categories
              </Link>
              <a
                href="#trending"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Trending
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search articles..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search articles"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/') || isActive('/categories')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/categories')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <a
              href="#trending"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Trending
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search articles"
              />
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;