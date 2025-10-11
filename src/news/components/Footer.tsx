import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/mockData';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white hover:text-primary-400 transition-colors">
              DefinePress
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Your trusted source for breaking news, in-depth analysis, and comprehensive coverage 
              of global events. Stay informed with DefinePress.
            </p>
            <div className="mt-6 flex space-x-6">
              {/* Social Media Links */}
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.827.01 7.233.048 2.87.272.272 2.87.048 7.233.01 7.827 0 8.396 0 12.017c0 3.624.01 4.192.048 4.786.272 4.363 2.87 6.959 7.233 7.184.604.037 1.173.048 4.786.048 3.624 0 4.192-.01 4.786-.048 4.363-.272 6.959-2.87 7.184-7.233.037-.604.048-1.173.048-4.786 0-3.624-.01-4.192-.048-4.786C23.728 2.87 21.13.272 16.767.048 16.173.01 15.604 0 12.017 0zm0 2.158c3.556 0 3.978.01 5.387.048 2.7.123 4.177 1.6 4.3 4.301.038 1.409.048 1.831.048 5.387 0 3.556-.01 3.978-.048 5.387-.123 2.7-1.6 4.177-4.301 4.3-1.409.038-1.831.048-5.387.048-3.556 0-3.978-.01-5.387-.048-2.7-.123-4.177-1.6-4.3-4.301-.038-1.409-.048-1.831-.048-5.387 0-3.556.01-3.978.048-5.387.123-2.7 1.6-4.177 4.301-4.3 1.409-.038 1.831-.048 5.387-.048z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.017 5.838a6.18 6.18 0 100 12.36 6.18 6.18 0 000-12.36zm0 10.18a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 11-2.883 0 1.441 1.441 0 012.883 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors capitalize"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Advertise With Us
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} DefinePress. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/rss" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                RSS Feed
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Sitemap
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;