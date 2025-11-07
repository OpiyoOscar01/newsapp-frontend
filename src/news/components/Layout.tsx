import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '', isLoading = false }) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync loading state
  useEffect(() => {
    setShowLoader(isLoading);
  }, [isLoading]);

  // Track scroll progress for the reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🆕 Scroll to top when the page (Layout) mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col scroll-smooth">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />

      {/* Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md">
          <div className="flex flex-col items-center space-y-6 animate-fadeIn">
            {/* Multi-ring Spinner */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute inset-2 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-8 bg-primary-600 rounded-full animate-pulse"></div>
            </div>

            {/* Loading Text */}
            <div className="flex flex-col items-center space-y-3">
              <p className="text-xl font-bold text-gray-900 animate-pulse">Loading amazing content</p>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-3 h-3 bg-primary-700 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 scroll-smooth relative ${className}`}>
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-50/30 via-transparent to-transparent animate-gradientShift"></div>
          <div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary-50/20 via-transparent to-transparent animate-gradientShift"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {children}
      </main>

      <Footer />

      <ScrollControls />
    </div>
  );
};

// ------------------------------------------------------------
// Scroll Controls Component
// ------------------------------------------------------------
const ScrollControls: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuickNav, setShowQuickNav] = useState(false);

  // Show controls after scrolling down a bit
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
          {/* Quick Nav Toggle */}
          <button
            onClick={() => setShowQuickNav(!showQuickNav)}
            className="p-3 bg-slate-900 text-white rounded-full shadow-lg border-2 border-slate-700 hover:bg-slate-800 hover:scale-110 transition-all duration-300 group"
            aria-label="Quick navigation"
          >
            <svg
              className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>

          {/* Quick Nav Menu */}
          {showQuickNav && (
            <div className="bg-slate-900/95 backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-slate-700 p-2 space-y-2 animate-slideUp">
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm font-medium hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>Top</span>
              </button>

              <button
                onClick={scrollToBottom}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm font-medium hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>Bottom</span>
              </button>
            </div>
          )}

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-400/50 group"
            aria-label="Scroll to top"
          >
            <svg
              className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Layout;
