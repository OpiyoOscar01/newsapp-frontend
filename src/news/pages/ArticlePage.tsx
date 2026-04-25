import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, Tag } from 'lucide-react';

import { getArticleBySlug, getRelatedArticles } from '../data/dataService';
import { selectRandomAd } from '../utils/randomAdSelector';
import { paginate } from '../utils/paginationHelpers';
import { ROUTES } from '../routes/routes';

import RelatedArticles from '../components/RelatedArticles';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import { ArticlePageSkeleton } from '../components/LoadingSkeletons';

import { useSubscribe } from '../api/newsletter/NewsletterQueries';
import { useRecordView } from '../api/article-interraction/ArticleInteractionQueries';

import type { Ad } from '../types';

import { useAppSelector } from '../../shared/hooks/useRedux';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../features/authentication/store/slices/authSlice';

import ArticlePageHeader from '../components/article/ArticlePageHeader';
import ArticlePageContent from '../components/article/ArticlePageContent';
import ArticleInteractionsPanel from '../components/article/ArticleInteractionsPanel';
import ArticlePageSidebar from '../components/article/ArticlePageSidebar';
import {
  type ArticleRecord,
  convertToArticleRecord,
}  from '../components/article/ArticlePage.shared';

const ArticlePage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterIsError, setNewsletterIsError] = useState(false);

  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [bottomAd, setBottomAd] = useState<Ad | null>(null);

  const [relatedPage, setRelatedPage] = useState(
    parseInt(searchParams.get('relatedPage') || '1', 10),
  );
  const [relatedItemsPerPage, setRelatedItemsPerPage] = useState(
    parseInt(searchParams.get('relatedPerPage') || '2', 10),
  );

  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [allRelatedArticles, setAllRelatedArticles] = useState<any[]>([]);
  const [articleLoading, setArticleLoading] = useState(true);
  const [articleError, setArticleError] = useState<string | null>(null);

  const viewTrackedForArticleId = useRef<number | null>(null);

  const { mutate: recordView } = useRecordView();

  const { mutate: subscribe, isPending: newsletterLoading } = useSubscribe({
    onSuccess: (data) => {
      setNewsletterMessage(data.message);
      setNewsletterIsError(false);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
    onError: (error: any) => {
      setNewsletterMessage(error?.response?.data?.message || 'Subscription failed');
      setNewsletterIsError(true);
      setTimeout(() => setNewsletterMessage(''), 3000);
    },
  });

  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      setNewsletterEmail(currentUser.email);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    let cancelled = false;

    const loadArticle = async () => {
      if (!articleSlug) {
        setArticleError('Article slug is required');
        setArticleLoading(false);
        return;
      }

      try {
        setArticleLoading(true);
        setArticleError(null);

        const articleData = await getArticleBySlug(articleSlug);

        if (cancelled) return;

        if (!articleData) {
          setArticleError('Article not found');
          return;
        }

        const normalizedArticle = convertToArticleRecord(articleData);
        setArticle(normalizedArticle);

        setSidebarAd(selectRandomAd(normalizedArticle.category, 'sidebar'));
        setBottomAd(selectRandomAd(normalizedArticle.category, 'bottom'));
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load article:', error);
          setArticleError('Failed to load article content');
        }
      } finally {
        if (!cancelled) setArticleLoading(false);
      }
    };

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [articleSlug]);

  useEffect(() => {
    let cancelled = false;

    const loadRelated = async () => {
      if (!article) return;

      try {
        const articleForRelated = {
          ...article,
          id: String(article.id),
        };

        const related = await getRelatedArticles(articleForRelated as any, 12);

        if (!cancelled) {
          setAllRelatedArticles(related || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load related articles:', error);
        }
      }
    };

    loadRelated();

    return () => {
      cancelled = true;
    };
  }, [article]);

  useEffect(() => {
    if (!article?.id) return;
    if (viewTrackedForArticleId.current === article.id) return;

    viewTrackedForArticleId.current = article.id;

    recordView({
      articleId: article.id,
      data: { referrer: document.referrer || undefined },
    });
  }, [article?.id, recordView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRelatedPage(1);
  }, [articleSlug]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (relatedPage > 1) params.set('relatedPage', relatedPage.toString());
    else params.delete('relatedPage');

    if (relatedItemsPerPage !== 2) {
      params.set('relatedPerPage', relatedItemsPerPage.toString());
    } else {
      params.delete('relatedPerPage');
    }

    setSearchParams(params, { replace: true });
  }, [relatedPage, relatedItemsPerPage, searchParams, setSearchParams]);

  const paginatedRelatedArticles = useMemo(() => {
    return paginate(allRelatedArticles, relatedPage, relatedItemsPerPage);
  }, [allRelatedArticles, relatedPage, relatedItemsPerPage]);

  const handleRetry = () => window.location.reload();

  const handleRelatedPageChange = (page: number) => {
    setRelatedPage(page);
    document
      .getElementById('related-articles-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRelatedItemsPerPageChange = (newItemsPerPage: number) => {
    setRelatedItemsPerPage(newItemsPerPage);
    setRelatedPage(1);
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    subscribe({ email: newsletterEmail.trim() });
  };

  if (articleLoading) return <ArticlePageSkeleton />;

  if (articleError || !article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 mb-4 text-3xl font-bold text-gray-900">
            Article Not Found
          </h1>
          <p className="mb-8 text-gray-600">
            {articleError || 'The requested article does not exist.'}
          </p>

          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>

            <Link
              to={ROUTES.HOME}
              className="cursor-pointer px-4 py-2 font-medium text-blue-600 hover:text-blue-700"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        <article className="lg:col-span-3">
          <ArticlePageHeader article={article} />

          <ArticlePageContent article={article} mobileAd={sidebarAd} />

          <div className="mb-12">
            <ArticleInteractionsPanel
              articleId={article.id}
              articleTitle={article.title}
              articleSummary={article.summary}
            />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Tag className="h-5 w-5" />
                Tags
              </h3>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex cursor-pointer items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {bottomAd && (
            <div className="mb-12">
              <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 p-2 shadow-sm">
                <AdBanner ad={bottomAd} placement="bottom" className="w-full" />
              </div>
            </div>
          )}

          <div id="related-articles-section" className="mb-12 scroll-mt-24">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>

              {allRelatedArticles.length > 2 && (
                <div className="flex items-center space-x-3">
                  <label className="whitespace-nowrap text-sm font-medium text-gray-700">
                    Show:
                  </label>

                  <select
                    value={relatedItemsPerPage}
                    onChange={(e) =>
                      handleRelatedItemsPerPageChange(Number(e.target.value))
                    }
                    className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2">2 articles</option>
                    <option value="4">4 articles</option>
                    <option value="6">6 articles</option>
                    <option value="12">12 articles</option>
                  </select>
                </div>
              )}
            </div>

            {allRelatedArticles.length > 0 ? (
              <>
                {allRelatedArticles.length > relatedItemsPerPage && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Showing{' '}
                      {Math.min(
                        (relatedPage - 1) * relatedItemsPerPage + 1,
                        allRelatedArticles.length,
                      )}
                      -
                      {Math.min(
                        relatedPage * relatedItemsPerPage,
                        allRelatedArticles.length,
                      )}{' '}
                      of{' '}
                      <span className="font-semibold">
                        {allRelatedArticles.length}
                      </span>{' '}
                      related articles
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
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
                No related articles available right now.
              </div>
            )}
          </div>
        </article>

        <ArticlePageSidebar
          article={article}
          sidebarAd={sidebarAd}
          newsletterEmail={newsletterEmail}
          setNewsletterEmail={setNewsletterEmail}
          newsletterLoading={newsletterLoading}
          newsletterMessage={newsletterMessage}
          newsletterIsError={newsletterIsError}
          onNewsletterSubmit={handleNewsletterSubmit}
          isAuthenticated={isAuthenticated}
          currentUserEmail={currentUser?.email}
        />
      </div>
    </div>
  );
};

export default ArticlePage;
