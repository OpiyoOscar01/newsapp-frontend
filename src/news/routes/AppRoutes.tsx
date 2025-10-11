import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import LandingPage from '../pages/LandingPage';
import CategoryPage from '../pages/CategoryPage';
import ArticlePage from '../pages/ArticlePage';
import SearchPage from '../pages/SearchPage';

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Category Pages */}
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        
        {/* Individual Article Page */}
        <Route path="/article/:articleId" element={<ArticlePage />} />
        
        {/* Search Results Page */}
        <Route path="/search" element={<SearchPage />} />
        
        {/* Static Pages (can be implemented later) */}
        <Route path="/about" element={<StaticPage title="About Us" />} />
        <Route path="/contact" element={<StaticPage title="Contact" />} />
        <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
        <Route path="/terms" element={<StaticPage title="Terms of Service" />} />
        <Route path="/advertise" element={<StaticPage title="Advertise With Us" />} />
        <Route path="/newsletter" element={<StaticPage title="Newsletter" />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

// Simple static page component for placeholder pages
const StaticPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">
          This page is under construction. Please check back later.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

// 404 Not Found page
const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Go to Homepage
          </a>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppRoutes;