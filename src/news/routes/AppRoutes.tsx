// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import LandingPage from '../pages/LandingPage';
import CategoryPage from '../pages/CategoryPage';
import ArticlePage from '../pages/ArticlePage';
import SearchPage from '../pages/SearchPage';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';
import TermsOfService from '../components/TermsOfService';
import PrivacyPolicy from '../components/PrivacyPolicy';
import AdvertiseWithUs from '../components/AdvertiseWithUs';
import Newsletter from '../components/NewsLetter';
import ScrollToTop from '../components/ScrollToTop';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/category/:categorySlug" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/article/:articleId" element={<Layout><ArticlePage /></Layout>} />
        <Route path="/search" element={<Layout><SearchPage /></Layout>} />
        
        {/* Public Pages with Layout */}
        <Route path="/about" element={<Layout><AboutUs /></Layout>} />
        <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
        <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
        <Route path="/advertise" element={<Layout><AdvertiseWithUs /></Layout>} />
        <Route path="/newsletter" element={<Layout><Newsletter /></Layout>} />
        
        {/* Admin Routes (without main layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* 404 Page */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </>
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