// src/pages/ArticlePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Home, 
  ChevronRight, 
  Clock, 
  Tag, 
  Calendar, 
  User,
  AlertCircle 
} from 'lucide-react';
import { getArticleBySlug, getRelatedArticles, recordArticleView } from '../data/dataService';
import { selectRandomAd } from '../utils/randomAdSelector';
import { formatFullDate } from '../utils/formatDate';
import { paginate } from '../utils/paginationHelpers';
import { type Ad } from '../types';
import ShareButtons from '../components/ShareButtons';
import RelatedArticles from '../components/RelatedArticles';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import { ArticlePageSkeleton } from '../components/LoadingSkeletons';
import { ROUTES } from '../routes/routes';
import { useSubscribe } from '../api/newsletter/NewsletterQueries';
import { useAppSelector } from '../../shared/hooks/useRedux';
import { selectUser, selectIsAuthenticated } from '../../features/authentication/store/slices/authSlice';

const ArticlePage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get auth state from Redux
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterIsError, setNewsletterIsError] = useState(false);
  
  // Prefill email from auth slice if user is logged in
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setNewsletterEmail(user.email);
    }
  }, [isAuthenticated, user]);
  
  // Subscribe mutation
  const { mutate: subscribe, isPending: newsletterLoading } = useSubscribe({
    onSuccess: (data) => {
      setNewsletterMessage(data.message);
      setNewsletterIsError(false);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
    onError: (error: any) => {
      setNewsletterMessage(error.response?.data?.message || 'Subscription failed');
      setNewsletterIsError(true);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
  });
  
  useEffect(() => {
    if (articleSlug) {
      // trackVisitor({ articleSlug });
    }
  }, [articleSlug]);
  
  // Ad states
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [bottomAd, setBottomAd] = useState<Ad | null>(null);
  
  const [relatedPage, setRelatedPage] = useState(parseInt(searchParams.get('relatedPage') || '1'));
  const [relatedItemsPerPage, setRelatedItemsPerPage] = useState(parseInt(searchParams.get('relatedPerPage') || '2'));
  
  const [article, setArticle] = useState<any>(null);
  const [allRelatedArticles, setAllRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load article data by slug
  useEffect(() => {
    const loadArticleData = async () => {
      if (!articleSlug) {
        setError('Article slug is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const articleData = await getArticleBySlug(articleSlug);
        if (!articleData) {
          setError('Article not found');
          setLoading(false);
          return;
        }
        setArticle(articleData);

        await recordArticleView(articleData.id);

        const related = await getRelatedArticles(articleData, 12);
        setAllRelatedArticles(related);

        const sidebar = selectRandomAd(articleData.category, 'sidebar');
        const bottom = selectRandomAd(articleData.category, 'bottom');
        
        setSidebarAd(sidebar);
        setBottomAd(bottom);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article content');
      } finally {
        setLoading(false);
      }
    };

    loadArticleData();
  }, [articleSlug]);

  // Paginate related articles
  const paginatedRelatedArticles = useMemo(() => {
    return paginate(allRelatedArticles, relatedPage, relatedItemsPerPage);
  }, [allRelatedArticles, relatedPage, relatedItemsPerPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setRelatedPage(1);
  }, [articleSlug]);

  useEffect(() => {
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
  }, [relatedPage, relatedItemsPerPage, setSearchParams, searchParams]);

  const handleRelatedPageChange = (page: number) => {
    setRelatedPage(page);
    const relatedSection = document.getElementById('related-articles-section');
    if (relatedSection) {
      relatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRelatedItemsPerPageChange = (newItemsPerPage: number) => {
    setRelatedItemsPerPage(newItemsPerPage);
    setRelatedPage(1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    subscribe({ email: newsletterEmail });
  };

  if (loading) {
    return <ArticlePageSkeleton />;
  }

  if (error || !article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested article does not exist.'}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <Link to={ROUTES.HOME} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const contentParagraphs = article.content ? article.content.split('\n\n') : [];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      world: 'bg-red-100 text-red-800',
      business: 'bg-green-100 text-green-800',
      technology: 'bg-blue-100 text-blue-800',
      sports: 'bg-orange-100 text-orange-800',
      health: 'bg-purple-100 text-purple-800',
      science: 'bg-indigo-100 text-indigo-800',
      entertainment: 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to={ROUTES.HOME} className="hover:text-blue-600 transition-colors cursor-pointer flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li>
                <Link 
                  to={ROUTES.buildCategoryRoute(article.category)} 
                  className="hover:text-blue-600 capitalize transition-colors cursor-pointer"
                >
                  {article.category}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-gray-700 truncate max-w-md">
                {article.title}
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{article.author}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatFullDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg';
                }}
              />
            </div>
          )}

          {/* Ad 1: Top Content Ad - Mobile */}
          {sidebarAd && (
            <div className="mb-8 lg:hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-2 border border-gray-200 shadow-sm">
                <AdBanner 
                  ad={sidebarAd} 
                  placement="inline"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {contentParagraphs.length > 0 ? (
              contentParagraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-800 leading-relaxed mb-6 text-lg">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-gray-800 leading-relaxed mb-6 text-lg">
                {article.content || article.summary || 'No content available.'}
              </p>
            )}
          </div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

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

          {/* Ad 2: Bottom Content Ad */}
          {bottomAd && (
            <div className="mb-12">
              <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-2 border border-gray-200 shadow-sm">
                <AdBanner 
                  ad={bottomAd} 
                  placement="bottom"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Related Articles with Pagination */}
          {allRelatedArticles.length > 0 && (
            <div id="related-articles-section" className="mb-12 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
                
                {allRelatedArticles.length > 2 && (
                  <div className="flex items-center space-x-3">
                    <label htmlFor="related-items-per-page" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Show:
                    </label>
                    <select
                      id="related-items-per-page"
                      value={relatedItemsPerPage}
                      onChange={(e) => handleRelatedItemsPerPageChange(parseInt(e.target.value))}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="2">2 articles</option>
                      <option value="4">4 articles</option>
                      <option value="6">6 articles</option>
                      <option value="12">12 articles</option>
                    </select>
                  </div>
                )}
              </div>

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
          <div className="sticky top-24 space-y-6 lg:space-y-8">
            {/* Sidebar Ad - Desktop only */}
            {sidebarAd && (
              <div className="hidden lg:block">
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200 shadow-sm">
                  <AdBanner 
                    ad={sidebarAd} 
                    placement="sidebar"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Article Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Info</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900 capitalize mt-1">
                    <Link 
                      to={ROUTES.buildCategoryRoute(article.category)}
                      className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {article.category}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Published</dt>
                  <dd className="text-sm text-gray-900 mt-1">{formatFullDate(article.publishedAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Read Time</dt>
                  <dd className="text-sm text-gray-900 mt-1">{article.readTime} minutes</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Author</dt>
                  <dd className="text-sm text-gray-900 mt-1">{article.author}</dd>
                </div>
              </dl>
            </div>

            {/* Newsletter Signup - Updated with useSubscribe hook */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest {article.category} articles delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {newsletterMessage && (
                <p className={`text-xs text-center mt-3 ${newsletterIsError ? 'text-red-600' : 'text-green-600'}`}>
                  {newsletterMessage}
                </p>
              )}
              
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticlePage;