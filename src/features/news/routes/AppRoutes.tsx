import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CategoryPage from '../components/CategoryPage';
import ArticlePage from '../components/ArticlePage';

/**
 * AppRoutes component handles all routing for the application
 * Uses React Router v6 for client-side routing
 */
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home route - redirects to categories */}
          <Route path="/" element={<Navigate to="/categories" replace />} />
          
          {/* Categories page */}
          <Route path="/categories" element={<CategoryPage />} />
          
          {/* Individual article page */}
          <Route path="/article/:id" element={<ArticlePage />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

/**
 * 404 Not Found page component
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or deleted.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/categories"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 mr-4"
          >
            Browse Categories
          </a>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Go Home
          </a>
        </div>
        
        {/* Decorative illustration */}
        <div className="mt-12 flex justify-center">
          <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-32 h-32 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.291-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppRoutes;