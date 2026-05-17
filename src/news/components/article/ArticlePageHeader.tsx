import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Clock, Home, User } from 'lucide-react';

import { formatFullDate } from '../../utils/formatDate';
import { ROUTES } from '../../routes/routes';

import type { ArticleRecord } from './ArticlePage.shared';
import { getCategoryColor } from './ArticlePage.shared';

interface ArticlePageHeaderProps {
  article: ArticleRecord;
}

const fallbackImage =
  'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg';

const ArticlePageHeader: React.FC<ArticlePageHeaderProps> = ({ article }) => {
  return (
    <>
      <nav className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <li>
            <Link to={ROUTES.HOME} className="flex items-center hover:text-blue-600">
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li>
            <Link
              to={ROUTES.buildCategoryRoute(article.category)}
              className="capitalize hover:text-blue-600"
            >
              {article.category}
            </Link>
          </li>
          <ChevronRight className="h-4 w-4" />
          <li className="max-w-md truncate text-gray-700">{article.title}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="mb-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${getCategoryColor(article.category)}`}
          >
            {article.category}
          </span>
        </div>

        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex flex-wrap items-center gap-4">
            {article.author && (
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
                  <User className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">{article.author}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatFullDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {article.imageUrl && (
        <div className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-64 w-full rounded-lg object-cover shadow-lg md:h-96"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>
      )}
    </>
  );
};

export default ArticlePageHeader;
