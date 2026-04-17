// pages/LandingPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { selectMultipleAds, selectRandomAd } from "../utils/randomAdSelector";
import { type Ad } from "../types";
import NormalContainer from "../components/landing/NormalContainer";
import BigContainer from "../components/landing/BigContainer";
import AdBanner from "../components/AdBanner";
import { LandingPageSkeleton } from "../components/LoadingSkeletons";
import "./styles/landing.css";
import { trackVisitor } from "../utils/visitorTracking";
import NewsCard from "../components/NewsCard";

import {
  useGetCategories,
  useGetFeaturedArticles,
  useGetArticlesByCategory,
} from "../api/NewsQueries";

import type {
  ApiCategory,
  ApiArticle,
  ApiErrorResponse,
  Category,
  Article as AppArticle,
} from "../api/NewsTypes";

/* -------------------------------------------------------------------------- */
/*                               CONSTANTS                                    */
/* -------------------------------------------------------------------------- */

const MOBILE_ITEMS_PER_CATEGORY = 6;
const DESKTOP_BIG_ITEMS = 4;
const DESKTOP_NORMAL_ITEMS = 5;
const MAX_ARTICLES_PER_CATEGORY = 50;

/** Flip to false to silence debug output in production */
const DEBUG = import.meta.env.DEV;

/* -------------------------------------------------------------------------- */
/*                          DEBUG HELPERS                                     */
/* -------------------------------------------------------------------------- */

interface ErrorDetails {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  method?: string;
  responseBody?: unknown;
  errorType: "network" | "timeout" | "http" | "unknown";
  raw: string;
}

/**
 * Extracts every useful piece of info from an AxiosError so we know
 * exactly what went wrong instead of just "Failed to load content".
 */
function getErrorDetails(
  error: AxiosError<ApiErrorResponse> | null
): ErrorDetails | null {
  if (!error) return null;

  const status = error.response?.status;
  const responseBody = error.response?.data as ApiErrorResponse | undefined;
  const message =
    responseBody?.message ||
    error.message ||
    "No message available";

  let errorType: ErrorDetails["errorType"] = "unknown";
  if (!error.response && error.request) errorType = "network";
  else if (error.code === "ECONNABORTED") errorType = "timeout";
  else if (status) errorType = "http";

  return {
    message,
    status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    responseBody,
    errorType,
    raw: JSON.stringify(
      { message, status, responseBody, code: error.code },
      null,
      2
    ),
  };
}

/* -------------------------------------------------------------------------- */
/*                          FORMATTER HELPERS                                 */
/* -------------------------------------------------------------------------- */

const formatCategory = (apiCategory: ApiCategory): Category => {
  const colorMap: Record<string, string> = {
    world: "bg-red-500",
    business: "bg-green-500",
    technology: "bg-blue-500",
    sports: "bg-orange-500",
    health: "bg-purple-500",
    science: "bg-indigo-500",
    general: "bg-gray-500",
    entertainment: "bg-pink-500",
    politics: "bg-yellow-500",
    environment: "bg-emerald-500",
    finance: "bg-lime-500",
    education: "bg-cyan-500",
  };

  const getCategoryColor = (slug: string): string => {
    if (colorMap[slug]) return colorMap[slug];
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500",
      "bg-teal-500", "bg-cyan-500", "bg-lime-500", "bg-amber-500",
    ];
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return {
    id: apiCategory.id.toString(),
    name: apiCategory.name,
    slug: apiCategory.slug,
    description:
      apiCategory.description || `${apiCategory.name} news and updates`,
    color: getCategoryColor(apiCategory.slug),
    isActive: apiCategory.is_active,
  };
};

const formatArticle = (apiArticle: ApiArticle): AppArticle => {
  const wordCount = apiArticle.content?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  let tags: string[] = [];
  if (apiArticle.tags) {
    if (typeof apiArticle.tags === "string") {
      try {
        tags = JSON.parse(apiArticle.tags);
      } catch {
        tags = apiArticle.tags.split(",").map((t) => t.trim());
      }
    } else if (Array.isArray(apiArticle.tags)) {
      tags = apiArticle.tags;
    }
  }

  return {
    id: apiArticle.id.toString(),
    title: apiArticle.title,
    summary: apiArticle.excerpt || apiArticle.description || "",
    content: apiArticle.content || "",
    author: apiArticle.author || "Unknown",
    publishedAt: apiArticle.published_at,
    imageUrl: apiArticle.image_url || "",
    category: apiArticle.category_model?.name || apiArticle.category,
    readTime,
    tags,
    url: apiArticle.url ?? undefined,
    source: apiArticle.source ?? undefined,
    viewCount: apiArticle.view_count,
    isFeatured: apiArticle.is_featured,
    slug: apiArticle.slug, // This is the slug for URL routing
  };
};

/* ========================================================================== */
/*                            LANDING PAGE                                    */
/* ========================================================================== */

const LandingPage: React.FC = () => {
  /* ── visitor tracking ───────────────────────────────────────────────────── */
  useEffect(() => {
    trackVisitor();
  }, []);

  /* ── ad state ───────────────────────────────────────────────────────────── */
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([]);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [betweenCategoriesAdPool, setBetweenCategoriesAdPool] = useState<Ad[]>(
    []
  );

  useEffect(() => {
    setFeaturedAds(selectMultipleAds("landing", 2, "banner"));
    setSidebarAd(selectRandomAd("landing", "sidebar"));
    setBetweenCategoriesAdPool(selectMultipleAds("landing", 2, "banner"));
  }, []);

  const betweenAd = useMemo(
    () => betweenCategoriesAdPool[0] ?? featuredAds[1] ?? null,
    [betweenCategoriesAdPool, featuredAds]
  );

  /* ── deferred bottom ad ─────────────────────────────────────────────────── */
  const [renderDeferredFinalAd, setRenderDeferredFinalAd] = useState(false);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bottomSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRenderDeferredFinalAd(true);
          obs.disconnect();
        }
      },
      { rootMargin: "800px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── CATEGORIES ─────────────────────────────────────────────────────────── */
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    status: categoriesStatus,
    fetchStatus: categoriesFetchStatus,
  } = useGetCategories({ staleTime: 1000 * 60 * 5 });

  // Log every categories query state change
  useEffect(() => {
    if (!DEBUG) return;
    console.group("[LandingPage] Categories Query");
    console.log("status:", categoriesStatus, "| fetchStatus:", categoriesFetchStatus);
    console.log("data:", categoriesData);
    console.log("error:", categoriesError);
    if (categoriesError) {
      console.error("categories error details:", getErrorDetails(categoriesError));
    }
    console.groupEnd();
  }, [categoriesData, categoriesError, categoriesStatus, categoriesFetchStatus]);

  const categories = useMemo<Category[]>(() => {
    if (!categoriesData) return [];
    const raw = Array.isArray(categoriesData) ? categoriesData : [];
    if (DEBUG) console.log("[LandingPage] Formatting", raw.length, "categories");
    return raw.map((cat: ApiCategory) => formatCategory(cat));
  }, [categoriesData]);

  /* ── FEATURED ARTICLES ──────────────────────────────────────────────────── */
  const {
    data: featuredArticlesData,
    isLoading: featuredLoading,
    error: featuredError,
    status: featuredStatus,
    fetchStatus: featuredFetchStatus,
  } = useGetFeaturedArticles({ staleTime: 1000 * 60 * 3 });

  useEffect(() => {
    if (!DEBUG) return;
    console.group("[LandingPage] Featured Articles Query");
    console.log("status:", featuredStatus, "| fetchStatus:", featuredFetchStatus);
    console.log("data:", featuredArticlesData);
    console.log("error:", featuredError);
    if (featuredError) {
      console.error("featured error details:", getErrorDetails(featuredError));
    }
    console.groupEnd();
  }, [featuredArticlesData, featuredError, featuredStatus, featuredFetchStatus]);

  /**
   * Derived directly from query data — no useState/useEffect sync needed.
   * Re-computes automatically whenever featuredArticlesData reference changes.
   */
  const featuredArticle = useMemo<AppArticle | null>(() => {
    if (!featuredArticlesData || !Array.isArray(featuredArticlesData) || featuredArticlesData.length === 0) {
      return null;
    }
    return formatArticle(featuredArticlesData[0]);
  }, [featuredArticlesData]);

  /* ── CATEGORY SLUGS ─────────────────────────────────────────────────────── */
  const categorySlugs = useMemo(
    () => categories.map((c) => c.slug),
    [categories]
  );

  /*
   * React Query hooks MUST be called unconditionally (Rules of Hooks).
   * We pre-allocate 10 slots and use the `enabled` flag to gate fetching.
   * When categories aren't loaded yet, every slug is '' and enabled=false,
   * so no network requests fire until categories resolve.
   */
  const makeOpts = (idx: number) => ({
    enabled: !!categorySlugs[idx] && categories.length > idx,
    staleTime: 1000 * 60 * 5,
  });

  const query1  = useGetArticlesByCategory(categorySlugs[0]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(0));
  const query2  = useGetArticlesByCategory(categorySlugs[1]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(1));
  const query3  = useGetArticlesByCategory(categorySlugs[2]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(2));
  const query4  = useGetArticlesByCategory(categorySlugs[3]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(3));
  const query5  = useGetArticlesByCategory(categorySlugs[4]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(4));
  const query6  = useGetArticlesByCategory(categorySlugs[5]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(5));
  const query7  = useGetArticlesByCategory(categorySlugs[6]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(6));
  const query8  = useGetArticlesByCategory(categorySlugs[7]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(7));
  const query9  = useGetArticlesByCategory(categorySlugs[8]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(8));
  const query10 = useGetArticlesByCategory(categorySlugs[9]  ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(9));

  /** All category queries aligned by index with the categories array */
  const allQueries = useMemo(
    () =>
      [query1, query2, query3, query4, query5,
       query6, query7, query8, query9, query10].slice(0, categories.length),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query1, query2, query3, query4, query5,
     query6, query7, query8, query9, query10,
     categories.length]
  );

  // Log every category query state change
  useEffect(() => {
    if (!DEBUG) return;
    allQueries.forEach((q, i) => {
      const slug = categorySlugs[i];
      if (!slug) return;
      console.group(`[LandingPage] Category Query [${i}] — "${slug}"`);
      console.log("status:", q.status, "| fetchStatus:", q.fetchStatus, "| enabled:", makeOpts(i).enabled);
      console.log("article count:", Array.isArray(q.data) ? q.data.length : "no data");
      if (q.error) console.error("error details:", getErrorDetails(q.error));
      console.groupEnd();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQueries]);

  /**
   * BUG FIX: Was using useState + useEffect with a broken dep array:
   *   `allQueries.map(q => q?.data).join(',')` — joining arrays of objects
   *   produces "[object Object],[object Object]" which never meaningfully
   *   changes, so the effect either never re-ran or ran on every render.
   *
   * SOLUTION: Pure useMemo. Recomputes whenever any query object changes
   * (React Query returns new references when data/status changes).
   */
  const categoryArticles = useMemo<Map<string, AppArticle[]>>(() => {
    const map = new Map<string, AppArticle[]>();

    categories.forEach((category, index) => {
      const query = allQueries[index];
      if (DEBUG) {
        console.log(
          `[LandingPage] categoryArticles memo — "${category.slug}":`,
          query ? `status=${query.status}, count=${Array.isArray(query.data) ? query.data.length : 0}` : "no query"
        );
      }
      if (query?.data && Array.isArray(query.data)) {
        map.set(category.slug, query.data.map((a: ApiArticle) => formatArticle(a)));
      } else {
        map.set(category.slug, []);
      }
    });

    return map;
  }, [categories, allQueries]);

  /* ── AGGREGATE ERROR STATE ──────────────────────────────────────────────── */

  /**
   * Returns the first error found across all queries, with full detail.
   * Because we surface `ErrorDetails` instead of just a string, the error
   * UI can show status codes, URLs, and response bodies — no more mystery.
   */
  const firstError = useMemo<ErrorDetails | null>(() => {
    const categoriesErr = getErrorDetails(categoriesError ?? null);
    if (categoriesErr) {
      if (DEBUG) console.error("[LandingPage] CATEGORIES ERROR:", categoriesErr);
      return { ...categoriesErr, message: `Categories: ${categoriesErr.message}` };
    }

    const featuredErr = getErrorDetails(featuredError ?? null);
    if (featuredErr) {
      if (DEBUG) console.error("[LandingPage] FEATURED ERROR:", featuredErr);
      return { ...featuredErr, message: `Featured articles: ${featuredErr.message}` };
    }

    const failedCategoryQuery = allQueries.find((q) => q?.error);
    if (failedCategoryQuery?.error) {
      const catIdx = allQueries.indexOf(failedCategoryQuery);
      const slug = categorySlugs[catIdx] ?? "unknown";
      const catErr = getErrorDetails(failedCategoryQuery.error);
      if (catErr) {
        if (DEBUG) console.error(`[LandingPage] CATEGORY "${slug}" ERROR:`, catErr);
        return { ...catErr, message: `"${slug}" articles: ${catErr.message}` };
      }
    }

    return null;
  }, [categoriesError, featuredError, allQueries, categorySlugs]);

  /* ── LOADING STATE ──────────────────────────────────────────────────────── */
  /**
   * Only show the full-page skeleton while initial data (categories + featured)
   * is loading.  Category articles load progressively — they render as each
   * query resolves rather than blocking the entire page.
   */
  const isInitialLoading = categoriesLoading || featuredLoading;

  /* ── SLICE HELPER ───────────────────────────────────────────────────────── */
  const getCategorySlice = (slug: string, isBig: boolean): AppArticle[] => {
    const list = categoryArticles.get(slug) ?? [];
    const want = isBig
      ? Math.max(DESKTOP_BIG_ITEMS, MOBILE_ITEMS_PER_CATEGORY)
      : Math.max(DESKTOP_NORMAL_ITEMS, MOBILE_ITEMS_PER_CATEGORY);
    return list.slice(0, want);
  };

  const generalCategory = categories.find((c) => c.slug === "general") ?? categories[0];
  const remainingCategories = categories.filter((c) => c.slug !== generalCategory?.slug);

  /* ====================================================================== */
  /*                              EARLY RETURNS                             */
  /* ====================================================================== */

  if (isInitialLoading) return <LandingPageSkeleton />;

  if (firstError) {
    return <ErrorScreen error={firstError} />;
  }

  /* ====================================================================== */
  /*                               RENDER                                   */
  /* ====================================================================== */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

      {/* ── Top Banner ────────────────────────────────────────────────── */}
      {featuredAds[0] && (
        <section className="mb-8 md:mb-12">
          <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-1 border-2 border-gray-200">
            <AdBanner
              ad={featuredAds[0]}
              placement="banner"
              size="leaderboard"
              className="min-h-[90px] md:min-h-[120px]"
            />
          </div>
        </section>
      )}

      {/* ── Featured Article + Sidebar Ad ─────────────────────────────── */}
      {featuredArticle && (
        <section className="mb-10 md:mb-16 -mx-4 sm:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Featured
                  </h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />
                </div>
              </div>
              <NewsCard
                article={featuredArticle}
                variant="hero"
                priority="high"
                isFeaturedHero
                isFirstInCategory
                showCategory
              />
            </div>

            {sidebarAd && (
              <div className="px-4 sm:px-0">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-gray-50 rounded-lg p-2 border-2 border-gray-200">
                    <div className="hidden lg:block">
                      <AdBanner
                        ad={sidebarAd}
                        placement="sidebar"
                        size="medium-rectangle"
                        className="min-h-[250px]"
                      />
                    </div>
                    <div className="lg:hidden">
                      <AdBanner
                        ad={sidebarAd}
                        placement="inline"
                        size="banner"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Category Sections ─────────────────────────────────────────── */}
      <div className="space-y-10 md:space-y-20">

        {/* General / Big Container */}
        {generalCategory && (
          <CategorySection
            category={generalCategory}
            articleCount={categoryArticles.get(generalCategory.slug)?.length ?? 0}
            isLoading={allQueries[categories.findIndex(c => c.slug === generalCategory.slug)]?.isLoading ?? false}
          >
            <BigContainer
              articles={getCategorySlice(generalCategory.slug, true)}
              exploreHref={`/category/${generalCategory.slug}`}
              sidebarAd={selectRandomAd("landing", "sidebar")}
              showAdHelperText={false}
            />
          </CategorySection>
        )}

        {/* Remaining / Normal Containers */}
        {remainingCategories.map((category, index) => {
          const articles = getCategorySlice(category.slug, false);
          const catIndex = categories.findIndex(c => c.slug === category.slug);
          const isLoadingCat = allQueries[catIndex]?.isLoading ?? false;

          // Show skeleton placeholder while this specific category loads
          if (isLoadingCat) {
            return (
              <section key={category.slug} className="scroll-mt-20" data-category={category.slug}>
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded-lg" />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // Skip if no articles and not loading (category may be empty)
          if (articles.length === 0) return null;

          const shouldInsertAd = (index + 1) % 2 === 0;

          return (
            <CategorySection
              key={category.slug}
              category={category}
              articleCount={categoryArticles.get(category.slug)?.length ?? 0}
              isLoading={false}
            >
              <NormalContainer
                articles={articles}
                exploreHref={`/category/${category.slug}`}
                shouldInsertAd={shouldInsertAd}
                index={index}
              />
            </CategorySection>
          );
        })}
      </div>

      {/* ── Sentinel for deferred ad ──────────────────────────────────── */}
      <div ref={bottomSentinelRef} className="h-px w-full" />

      {renderDeferredFinalAd && betweenAd && (
        <section className="w-full my-10 md:my-12">
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-2 border-2 border-gray-200">
            <AdBanner
              ad={betweenAd}
              placement="landing"
              size="leaderboard"
              className="min-h-[90px] md:min-h-[120px]"
            />
          </div>
        </section>
      )}

      {/* ── Newsletter ────────────────────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
};

/* ========================================================================== */
/*                          SUB-COMPONENTS                                    */
/* ========================================================================== */

/* ── Category Section wrapper ─────────────────────────────────────────────── */

interface CategorySectionProps {
  category: Category;
  articleCount: number;
  isLoading: boolean;
  children: React.ReactNode;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  articleCount,
  isLoading,
  children,
}) => (
  <section className="scroll-mt-20" data-category={category.slug}>
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize">
            {category.name}
          </h2>
          {!isLoading && (
            <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              {articleCount} articles
            </span>
          )}
        </div>
      </div>
      <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />
      <div className="w-full mt-8">{children}</div>
    </div>
  </section>
);

/* ── Error Screen ─────────────────────────────────────────────────────────── */

interface ErrorScreenProps {
  error: ErrorDetails;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  const [showRaw, setShowRaw] = useState(false);

  const typeLabel: Record<ErrorDetails["errorType"], string> = {
    network: "Network Error — the server could not be reached",
    timeout: "Request Timed Out",
    http: `HTTP ${error.status ?? ""} ${error.statusText ?? ""}`,
    unknown: "Unknown Error",
  };

  const typeColor: Record<ErrorDetails["errorType"], string> = {
    network: "bg-orange-100 text-orange-700",
    timeout: "bg-yellow-100 text-yellow-700",
    http: "bg-red-100 text-red-700",
    unknown: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <svg
          className="mx-auto h-14 w-14 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-2xl font-bold text-gray-900">
          Failed to Load Content
        </h3>
      </div>

      {/* Error type badge */}
      <div className="flex justify-center mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${typeColor[error.errorType]}`}
        >
          {typeLabel[error.errorType]}
        </span>
      </div>

      {/* Human-readable message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-red-800">{error.message}</p>
      </div>

      {/* URL + method */}
      {(error.url || error.method) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-xs font-mono text-gray-600">
          {error.method && (
            <span className="font-bold text-gray-800 mr-2">{error.method}</span>
          )}
          {error.url && <span>{error.url}</span>}
        </div>
      )}

      {/* Collapsible raw details */}
      <div className="mb-6">
        <button
          onClick={() => setShowRaw((s) => !s)}
          className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors cursor-pointer"
        >
          {showRaw ? "Hide" : "Show"} raw error details
        </button>
        {showRaw && (
          <pre className="mt-2 p-4 bg-gray-900 text-green-400 text-xs rounded-lg overflow-x-auto whitespace-pre-wrap max-h-64">
            {error.raw}
          </pre>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors cursor-pointer"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
    </div>
  );
};

/* ── Newsletter section ───────────────────────────────────────────────────── */

const NewsletterSection: React.FC = () => (
  <section className="mt-16 md:mt-24">
    <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50/30 rounded-3xl overflow-hidden shadow-xl border border-primary-100">
      <div className="absolute inset-0 bg-grid-primary/[0.03] bg-[size:20px_20px]" />
      <div className="relative px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>Stay Informed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Never Miss a Story
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Get the latest news and exclusive insights delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 md:px-6 py-3 md:py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white shadow-sm cursor-text"
              required
            />
            <button
              type="submit"
              className="px-6 md:px-8 py-3 md:py-4 bg-primary-600 text-white text-base font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-6">
            By subscribing, you agree to our{" "}
            <Link to="/privacy" className="text-primary-600 hover:underline cursor-pointer">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default LandingPage;