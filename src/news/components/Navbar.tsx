// src/components/Navbar.tsx (Fixed dropdown with proper hover behavior)
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut, 
  ChevronDown,
  Newspaper,
  TrendingUp,
  FileText,
  Globe,
  Briefcase,
  Tv,
  Beaker,
  Trophy,
  Sparkles,
  Heart
} from 'lucide-react';
import { dataService } from '../data/dataService';
import { type Category } from '../types/news';
import SearchBar from './SearchBar';
import { ROUTES } from '../routes/routes';
import { useAppSelector } from '../../shared/hooks/useRedux';
import { selectIsAuthenticated, selectUser } from '../../features/authentication/store/slices/authSlice';
import { useLogout } from '../api/auth/AuthQueries';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  
  // Use logout hook from AuthQueries
  const { mutate: logout } = useLogout({
    onSuccess: () => {
      setIsMobileMenuOpen(false);
      navigate(ROUTES.HOME);
    },
    onError: () => {
      setIsMobileMenuOpen(false);
      navigate(ROUTES.HOME);
    }
  });

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
    if (query.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(ROUTES.SEARCH);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
    setIsMobileMenuOpen(false);
  };

  const handleRegister = () => {
    navigate(ROUTES.REGISTER);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleAdminDashboard = () => {
    navigate(ROUTES.ADMIN_DASHBOARD);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Get category icon based on category name
  const getCategoryIcon = (categoryName: string, index: number) => {
    const iconMap: { [key: string]: any } = {
      'general': Sparkles,
      'technology': TrendingUp,
      'business': Briefcase,
      'sports': Trophy,
      'science': Beaker,
      'entertainment': Tv,
      'world': Globe,
      'health': Heart,
    };
    
    const IconComponent = iconMap[categoryName.toLowerCase()];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    
    // Fallback icons based on index
    const fallbackIcons = [Globe, Briefcase, Tv, Beaker, Trophy, Newspaper, FileText];
    const FallbackIcon = fallbackIcons[index % fallbackIcons.length];
    return <FallbackIcon className="w-5 h-5" />;
  };

  // Show loading state
  if (loading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to={ROUTES.HOME} className="text-2xl font-bold text-gray-800 cursor-pointer">
                DefinePress
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="animate-pulse flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-gray-200 rounded cursor-pointer"></div>
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
              to={ROUTES.HOME}
              className="relative inline-block text-3xl font-extrabold tracking-tight text-transparent bg-clip-text 
               bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 
               hover:from-blue-500 hover:via-blue-600 hover:to-blue-800 
               transition-all duration-300 cursor-pointer"
            >
              Define<span className="text-gray-800">Press</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-700 scale-x-0 hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to={ROUTES.HOME}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 cursor-pointer ${
                  isActiveRoute(ROUTES.HOME) 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              {/* Sort categories: general first, then the rest */}
              {(() => {
                const generalCategory = categories.find(cat => cat.slug === 'general');
                const otherCategories = categories.filter(cat => cat.slug !== 'general');
                const sortedCategories = [];
                if (generalCategory) {
                  sortedCategories.push(generalCategory);
                }
                sortedCategories.push(...otherCategories);
                
                return sortedCategories.map((category, idx) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize flex items-center space-x-1 cursor-pointer ${
                      isActiveRoute(`/category/${category.slug}`)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {getCategoryIcon(category.name, idx)}
                    <span>{category.name}</span>
                  </Link>
                ));
              })()}
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
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {/* User Menu - Fixed dropdown with proper hover bridge */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">
                          {user.first_name ? user.first_name.charAt(0).toUpperCase() : 
                           user.name ? user.name.charAt(0).toUpperCase() : 
                           user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="hidden lg:block">
                        {user.first_name || user.name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu - Added pt-1 to create a bridge between button and dropdown */}
                    <div className="absolute right-0 pt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white rounded-md shadow-lg border py-1">
                        <div className="px-4 py-2 text-xs text-gray-500 border-b">
                          Signed in as<br />
                          <span className="font-medium text-gray-900">{user.email}</span>
                        </div>
                        
                        {/* Dashboard button - Only for admin users */}
                        {user.is_admin && (
                          <button
                            onClick={handleAdminDashboard}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 inline mr-2" />
                            Dashboard
                          </button>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors cursor-pointer"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {!isMobileMenuOpen ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
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
            className="md:hidden fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm animate-fadeIn cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sliding Menu Panel */}
          <div className="md:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl animate-slideInRight">
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* User Info Section - Only for authenticated users */}
              {isAuthenticated && user && (
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {user.first_name ? user.first_name.charAt(0).toUpperCase() : 
                         user.name ? user.name.charAt(0).toUpperCase() : 
                         user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.first_name || user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto py-4">
                {/* Search Section */}
                <div className="mb-6 px-4">
                  <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Search articles..." 
                    showButton={true}
                  />
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1 px-4">
                  <Link
                    to={ROUTES.HOME}
                    className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer ${
                      isActiveRoute(ROUTES.HOME)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className={`w-5 h-5 mr-3 ${isActiveRoute(ROUTES.HOME) ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>Home</span>
                  </Link>                  

                  {categories.map((category, idx) => {
                    const isActive = isActiveRoute(`/category/${category.slug}`);
                    return (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium capitalize transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                          {getCategoryIcon(category.name, idx)}
                        </div>
                        <span>{category.name}</span>
                      </Link>
                    );
                  })}

                  {/* Auth Section in Mobile Menu */}
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    {isAuthenticated && user ? (
                      <>
                        {user.is_admin && (
                          <button
                            onClick={handleAdminDashboard}
                            className="group flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                          >
                            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                            <span>Dashboard</span>
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="group flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                        >
                          <LogOut className="w-5 h-5 mr-3 text-red-400" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleLogin}
                          className="w-full mb-2 px-4 py-3 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={handleRegister}
                          className="w-full px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer"
                        >
                          Create Account
                        </button>
                      </>
                    )}
                  </div>
                </nav>
              </div>

              {/* Footer Section */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-center">
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