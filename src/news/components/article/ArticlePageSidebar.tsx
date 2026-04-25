import React from 'react';
import { Link } from 'react-router-dom';

import AdBanner from '../AdBanner';
import { formatFullDate } from '../../utils/formatDate';
import { ROUTES } from '../../routes/routes';

import type { Ad } from '../../types';
import type { ArticleRecord } from './ArticlePage.shared';

interface ArticlePageSidebarProps {
  article: ArticleRecord;
  sidebarAd: Ad | null;
  newsletterEmail: string;
  setNewsletterEmail: React.Dispatch<React.SetStateAction<string>>;
  newsletterLoading: boolean;
  newsletterMessage: string;
  newsletterIsError: boolean;
  onNewsletterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isAuthenticated: boolean;
  currentUserEmail?: string;
}

const ArticlePageSidebar: React.FC<ArticlePageSidebarProps> = ({
  article,
  sidebarAd,
  newsletterEmail,
  setNewsletterEmail,
  newsletterLoading,
  newsletterMessage,
  newsletterIsError,
  onNewsletterSubmit,
  isAuthenticated,
  currentUserEmail,
}) => {
  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24 space-y-6 lg:space-y-8">
        {sidebarAd && (
          <div className="hidden lg:block">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 shadow-sm">
              <AdBanner ad={sidebarAd} placement="sidebar" className="w-full" />
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Article Info</h3>

          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm capitalize">
                <Link
                  to={ROUTES.buildCategoryRoute(article.category)}
                  className="text-blue-600 hover:underline"
                >
                  {article.category}
                </Link>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Published</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatFullDate(article.publishedAt)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Read Time</dt>
              <dd className="mt-1 text-sm text-gray-900">{article.readTime} minutes</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Author</dt>
              <dd className="mt-1 text-sm text-gray-900">{article.author}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Stay Updated</h3>
          <p className="mb-4 text-sm text-gray-600">
            Get the latest {article.category} articles delivered to your inbox.
          </p>

          <form onSubmit={onNewsletterSubmit} className="space-y-3">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full cursor-text rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={newsletterLoading}
              className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {newsletterMessage && (
            <p
              className={`mt-3 text-center text-xs ${
                newsletterIsError ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {newsletterMessage}
            </p>
          )}

          {isAuthenticated && currentUserEmail && (
            <p className="mt-3 text-xs text-gray-500">
              Signed in as <span className="font-medium">{currentUserEmail}</span>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ArticlePageSidebar;
