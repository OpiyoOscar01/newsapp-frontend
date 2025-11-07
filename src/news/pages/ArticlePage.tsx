import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getArticleById, getRelatedArticles, categories } from '../data/mockData';
import { selectRandomAd, selectMultipleAds } from '../utils/randomAdSelector';
import { formatFullDate } from '../utils/formatDate';
import { paginate } from '../utils/paginationHelpers';
import {type Ad } from '../types';
import ShareButtons from '../components/ShareButtons';
import RelatedArticles from '../components/RelatedArticles';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';

const ArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [inlineAds, setInlineAds] = useState<Ad[]>([]);
  const [bottomAd, setBottomAd] = useState<Ad | null>(null);
  const [relatedPage, setRelatedPage] = useState(parseInt(searchParams.get('relatedPage') || '1'));
  const [relatedItemsPerPage, setRelatedItemsPerPage] = useState(parseInt(searchParams.get('relatedPerPage') || '2'));

  const article = articleId ? getArticleById(articleId) : null;
  const allRelatedArticles = article ? getRelatedArticles(article, 12) : []; // Fetch more related articles
  const category = article ? categories.find(cat => cat.slug === article.category) : null;

  // Paginate related articles
  const paginatedRelatedArticles = useMemo(() => {
    return paginate(allRelatedArticles, relatedPage, relatedItemsPerPage);
  }, [allRelatedArticles, relatedPage, relatedItemsPerPage]);

  useEffect(() => {
    if (article) {
      // Load ads based on article category and keywords
      const sidebar = selectRandomAd(article.category, 'sidebar');
      const inline = selectMultipleAds('article', 2, 'inline');
      const bottom = selectRandomAd(article.category, 'bottom');
      
      setSidebarAd(sidebar);
      setInlineAds(inline);
      setBottomAd(bottom);
    }
  }, [article]);

  useEffect(() => {
    // Scroll to top when article changes
    window.scrollTo(0, 0);
    // Reset related articles pagination when article changes
    setRelatedPage(1);
  }, [articleId]);

  useEffect(() => {
    // Update URL with related articles pagination parameters
    const newParams = new URLSearchParams(searchParams);
    if (relatedPage > 1) {
      newParams.set('relatedPage', relatedPage.toString());
    } else {
      newParams.delete('relatedPage');
    }
    if (relatedItemsPerPage !== 2) {
      newParams.set('relatedPerPage', relatedItemsPerPage.toString());
    } else {
      newParams.delete('relatedPerPage');
    }
    setSearchParams(newParams, { replace: true });
  }, [relatedPage, relatedItemsPerPage]);

  const handleRelatedPageChange = (page: number) => {
    setRelatedPage(page);
    // Scroll to related articles section smoothly
    const relatedSection = document.getElementById('related-articles-section');
    if (relatedSection) {
      relatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRelatedItemsPerPageChange = (newItemsPerPage: number) => {
    setRelatedItemsPerPage(newItemsPerPage);
    setRelatedPage(1); // Reset to first page
  };

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The requested article does not exist.</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;

  // Split content into paragraphs for ad insertion
  const contentParagraphs = article.content.split('\n\n');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-primary-600">Home</Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link 
                  to={`/category/${article.category}`} 
                  className="hover:text-primary-600 capitalize"
                >
                  {category?.name || article.category}
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-700 truncate">
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                article.category === 'world' ? 'bg-red-100 text-red-800' :
                article.category === 'business' ? 'bg-green-100 text-green-800' :
                article.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                article.category === 'sports' ? 'bg-orange-100 text-orange-800' :
                article.category === 'health' ? 'bg-purple-100 text-purple-800' :
                article.category === 'science' ? 'bg-indigo-100 text-indigo-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {category?.name || article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{article.author}</p>
                    <p className="text-sm text-gray-500">{formatFullDate(article.publishedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{article.readTime} min read</span>
                  </span>
                </div>
              </div>
              
              <ShareButtons
                url={currentUrl}
                title={article.title}
                description={article.summary}
              />
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {contentParagraphs.map((paragraph, index) => (
              <div key={index}>
                <p className="text-gray-800 leading-relaxed mb-6 text-lg">
                  {paragraph}
                </p>
                
                {/* Insert inline ad after 2nd and 4th paragraphs */}
                {((index === 1 && inlineAds[0]) || (index === 3 && inlineAds[1])) && (
                  <div className="my-8">
                    <AdBanner 
                      ad={index === 1 ? inlineAds[0] : inlineAds[1]} 
                      placement="article" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Article Tags */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-12 p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enjoyed this article? Share it with others!
              </h3>
              <div className="flex justify-center">
                <ShareButtons
                  url={currentUrl}
                  title={article.title}
                  description={article.summary}
                />
              </div>
            </div>
          </div>

          {/* Related Articles with Pagination */}
          {allRelatedArticles.length > 0 && (
            <div id="related-articles-section" className="mb-12 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
                
                {/* Items per page selector for related articles */}
                {allRelatedArticles.length > 2 && (
                  <div className="flex items-center space-x-3">
                    <label htmlFor="related-items-per-page" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Show:
                    </label>
                    <select
                      id="related-items-per-page"
                      value={relatedItemsPerPage}
                      onChange={(e) => handleRelatedItemsPerPageChange(parseInt(e.target.value))}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="2">2 articles</option>
                      <option value="4">4 articles</option>
                      <option value="6">6 articles</option>
                      <option value="12">12 articles</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Results info */}
              {allRelatedArticles.length > relatedItemsPerPage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {Math.min((relatedPage - 1) * relatedItemsPerPage + 1, allRelatedArticles.length)}-
                    {Math.min(relatedPage * relatedItemsPerPage, allRelatedArticles.length)} of{' '}
                    <span className="font-semibold">{allRelatedArticles.length}</span> related articles
                  </p>
                </div>
              )}

              <RelatedArticles
                articles={paginatedRelatedArticles.items}
                title=""
                className=""
              />

              {/* Pagination for related articles */}
              {paginatedRelatedArticles.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={paginatedRelatedArticles.currentPage}
                    totalPages={paginatedRelatedArticles.totalPages}
                    onPageChange={handleRelatedPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Sidebar Ad */}
            {sidebarAd && (
              <AdBanner ad={sidebarAd} placement="article" />
            )}

            {/* Article Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Info</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900 capitalize">
                    <Link 
                      to={`/category/${article.category}`}
                      className="hover:text-primary-600"
                    >
                      {category?.name || article.category}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Published</dt>
                  <dd className="text-sm text-gray-900">{formatFullDate(article.publishedAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Read Time</dt>
                  <dd className="text-sm text-gray-900">{article.readTime} minutes</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Author</dt>
                  <dd className="text-sm text-gray-900">{article.author}</dd>
                </div>
              </dl>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest {category?.name.toLowerCase() || 'news'} articles delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Other Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Other Topics</h3>
              <div className="space-y-2">
                {categories
                  .filter(cat => cat.slug !== article.category)
                  .slice(0, 5)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors capitalize"
                    >
                      {cat.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Ad (Mobile) */}
      {bottomAd && (
        <div className="mt-12 lg:hidden">
          <AdBanner ad={bottomAd} placement="article" />
        </div>
      )}
    </div>
  );
};

export default ArticlePage;