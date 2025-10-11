import React from 'react';
import Navbar from './NavBar';
import { type LayoutProps } from '../types';

/**
 * Layout component that wraps all pages with consistent header and footer
 * Provides responsive container and consistent spacing
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold">Definepress</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted source for the latest news, insights, and stories from around the world.
                Stay informed with our comprehensive coverage across all major categories.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/categories"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href="#trending"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Trending
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#technology"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Technology
                  </a>
                </li>
                <li>
                  <a
                    href="#business"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Business
                  </a>
                </li>
                <li>
                  <a
                    href="#sports"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Sports
                  </a>
                </li>
                <li>
                  <a
                    href="#health"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Health
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  <span className="block">contact@Definepress.com</span>
                  <span className="block">+1 (555) 123-4567</span>
                </p>
                
                {/* Social Media Links */}
                <div className="flex space-x-4 pt-2">
                  <a
                    href="#twitter"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Follow us on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a
                    href="#facebook"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Follow us on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="#linkedin"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Follow us on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Definepress. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#privacy"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;