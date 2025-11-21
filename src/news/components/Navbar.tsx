// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { dataService } from '../data/dataService';
import { apiClient } from '../services/api/client';
import { type Category } from '../types/news';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await dataService.getCategories();
        if (categoriesData.length === 0) {
          setError('No categories available');
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setError('Failed to load navigation');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Check user authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        // Only check auth if we have a token
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await apiClient.get('/user');
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (query: string) => {
    console.log('🔍 Navbar search triggered:', query);
    
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
    
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    navigate('/admin/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.removeToken();
      setUser(null);
      setIsMobileMenuOpen(false);
      // Refresh the page to reset all states
      window.location.href = '/';
    }
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // const handleRetry = () => {
  //   window.location.reload();
  // };

  // Show loading state
  if (loading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-800">
                DefinePress
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="animate-pulse flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="relative inline-block text-3xl font-extrabold tracking-tight text-transparent bg-clip-text 
               bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 
               hover:from-blue-500 hover:via-blue-600 hover:to-blue-800 
               transition-all duration-300"
            >
              Define<span className="text-gray-800">Press</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-700 scale-x-0 hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveRoute('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    isActiveRoute(`/category/${category.slug}`)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Search & Auth */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-md">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search articles, topics, authors..."
                showButton={false}
              />
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {authLoading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  {/* Admin Dashboard Button */}
                  <button
                    onClick={handleAdminDashboard}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Dashboard</span>
                  </button>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 text-sm font-semibold">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="hidden lg:block">
                        {user.name || user.email?.split('@')[0]}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        Signed in as<br />
                        <span className="font-medium text-gray-900">{user.email}</span>
                      </div>
                      <button
                        onClick={handleAdminDashboard}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Admin Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Admin Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sliding Menu Panel */}
          <div className="md:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl animate-slideInRight">
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info Section */}
              {!authLoading && user && (
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 text-sm font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pl-10 py-1 w-full">
                {/* Search Section */}
                <div className="mb-6 px-4">
                  <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Search articles..." 
                    showButton={true}
                  />
                </div>

                {/* Navigation Links */}
                <div>
                  <nav className="space-y-1">
                    <Link
                      to="/"
                      className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActiveRoute('/')
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg 
                        className={`w-5 h-5 mr-3 ${
                          isActiveRoute('/') ? 'text-primary-600' : 'text-gray-400'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Home</span>
                    </Link>                  

                    {categories.map((category, index) => {
                      const isActive = isActiveRoute(`/category/${category.slug}`);
                      const categoryIcons = [
                        'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', // Technology
                        'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', // Business
                        'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Sports
                        'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', // Science
                        'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', // Entertainment
                        'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' // World
                      ];
                      
                      return (
                        <Link
                          key={category.id}
                          to={`/category/${category.slug}`}
                          className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium capitalize transition-all duration-200 ${
                            isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg 
                            className={`w-5 h-5 mr-3 ${
                              isActive ? 'text-primary-600' : 'text-gray-400'
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={categoryIcons[index % categoryIcons.length]} />
                          </svg>
                          <span>{category.name}</span>
                        </Link>
                      );
                    })}

                    {/* Admin Section in Mobile Menu */}
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      {!authLoading && user ? (
                        <>
                          <button
                            onClick={handleAdminDashboard}
                            className="group flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent transition-all duration-200"
                          >
                            <svg 
                              className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Admin Dashboard</span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="group flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-l-4 border-transparent transition-all duration-200"
                          >
                            <svg 
                              className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-500"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleLogin}
                          className="group flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 border-l-4 border-transparent transition-all duration-200"
                        >
                          <svg 
                            className="w-5 h-5 mr-3 text-primary-400 group-hover:text-primary-500"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>Admin Login</span>
                        </button>
                      )}
                    </div>
                  </nav>
                </div>
              </div>

              {/* Footer Section */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 text-xs">
                    © {new Date().getFullYear()} DefinePress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add custom animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;