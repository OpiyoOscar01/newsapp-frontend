// src/pages/LandingPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { AxiosError } from "axios";
import { selectMultipleAds, selectRandomAd } from "../utils/randomAdSelector";
import { type Ad } from "../types";
import NormalContainer from "../components/landing/NormalContainer";
import BigContainer from "../components/landing/BigContainer";
import { LandingPageSkeleton } from "../components/LoadingSkeletons";
import "./styles/landing.css";
import { trackVisitor } from "../utils/visitorTracking";
import TopBanner from "../../features/news/components/landing-page/TopBanner";
import FeaturedSection from "../../features/news/components/landing-page/FeaturedSection";
import CategorySection from "../../features/news/components/landing-page/CategorySection";
import NewsletterSection from "../../features/news/components/landing-page/NewsletterSection";
import BottomAd from "../../features/news/components/landing-page/BottomAd";
import ErrorScreen from "../../features/news/components/landing-page/ErrorScreen";

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
    slug: apiArticle.slug,
  };
};

/* ========================================================================== */
/*                            LANDING PAGE                                    */
/* ========================================================================== */

const LandingPage: React.FC = () => {
  useEffect(() => {
    trackVisitor();
  }, []);

  const [featuredAds, setFeaturedAds] = useState<Ad[]>([]);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [betweenCategoriesAdPool, setBetweenCategoriesAdPool] = useState<Ad[]>([]);

  useEffect(() => {
    setFeaturedAds(selectMultipleAds("landing", 2, "banner"));
    setSidebarAd(selectRandomAd("landing", "sidebar"));
    setBetweenCategoriesAdPool(selectMultipleAds("landing", 2, "banner"));
  }, []);

  const betweenAd = useMemo(
    () => betweenCategoriesAdPool[0] ?? featuredAds[1] ?? null,
    [betweenCategoriesAdPool, featuredAds]
  );

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

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    status: categoriesStatus,
    fetchStatus: categoriesFetchStatus,
  } = useGetCategories({ staleTime: 1000 * 60 * 5 });

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
    return raw.map((cat: ApiCategory) => formatCategory(cat));
  }, [categoriesData]);

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

  const featuredArticle = useMemo<AppArticle | null>(() => {
    if (!featuredArticlesData || !Array.isArray(featuredArticlesData) || featuredArticlesData.length === 0) {
      return null;
    }
    return formatArticle(featuredArticlesData[0]);
  }, [featuredArticlesData]);

  const categorySlugs = useMemo(
    () => categories.map((c) => c.slug),
    [categories]
  );

  const makeOpts = (idx: number) => ({
    enabled: !!categorySlugs[idx] && categories.length > idx,
    staleTime: 1000 * 60 * 5,
  });

  const query1 = useGetArticlesByCategory(categorySlugs[0] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(0));
  const query2 = useGetArticlesByCategory(categorySlugs[1] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(1));
  const query3 = useGetArticlesByCategory(categorySlugs[2] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(2));
  const query4 = useGetArticlesByCategory(categorySlugs[3] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(3));
  const query5 = useGetArticlesByCategory(categorySlugs[4] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(4));
  const query6 = useGetArticlesByCategory(categorySlugs[5] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(5));
  const query7 = useGetArticlesByCategory(categorySlugs[6] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(6));
  const query8 = useGetArticlesByCategory(categorySlugs[7] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(7));
  const query9 = useGetArticlesByCategory(categorySlugs[8] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(8));
  const query10 = useGetArticlesByCategory(categorySlugs[9] ?? "", MAX_ARTICLES_PER_CATEGORY, makeOpts(9));

  const allQueries = useMemo(
    () =>
      [query1, query2, query3, query4, query5,
        query6, query7, query8, query9, query10].slice(0, categories.length),
    [query1, query2, query3, query4, query5,
      query6, query7, query8, query9, query10,
      categories.length]
  );

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
  }, [allQueries]);

  const categoryArticles = useMemo<Map<string, AppArticle[]>>(() => {
    const map = new Map<string, AppArticle[]>();

    categories.forEach((category, index) => {
      const query = allQueries[index];
      if (query?.data && Array.isArray(query.data)) {
        map.set(category.slug, query.data.map((a: ApiArticle) => formatArticle(a)));
      } else {
        map.set(category.slug, []);
      }
    });

    return map;
  }, [categories, allQueries]);

  const firstError = useMemo<ErrorDetails | null>(() => {
    const categoriesErr = getErrorDetails(categoriesError ?? null);
    if (categoriesErr) {
      return { ...categoriesErr, message: `Categories: ${categoriesErr.message}` };
    }

    const featuredErr = getErrorDetails(featuredError ?? null);
    if (featuredErr) {
      return { ...featuredErr, message: `Featured articles: ${featuredErr.message}` };
    }

    const failedCategoryQuery = allQueries.find((q) => q?.error);
    if (failedCategoryQuery?.error) {
      const catIdx = allQueries.indexOf(failedCategoryQuery);
      const slug = categorySlugs[catIdx] ?? "unknown";
      const catErr = getErrorDetails(failedCategoryQuery.error);
      if (catErr) {
        return { ...catErr, message: `"${slug}" articles: ${catErr.message}` };
      }
    }

    return null;
  }, [categoriesError, featuredError, allQueries, categorySlugs]);

  const isInitialLoading = categoriesLoading || featuredLoading;

  const getCategorySlice = (slug: string, isBig: boolean): AppArticle[] => {
    const list = categoryArticles.get(slug) ?? [];
    const want = isBig
      ? Math.max(DESKTOP_BIG_ITEMS, MOBILE_ITEMS_PER_CATEGORY)
      : Math.max(DESKTOP_NORMAL_ITEMS, MOBILE_ITEMS_PER_CATEGORY);
    return list.slice(0, want);
  };

  const generalCategory = categories.find((c) => c.slug === "general") ?? categories[0];
  const remainingCategories = categories.filter((c) => c.slug !== generalCategory?.slug);

  if (isInitialLoading) return <LandingPageSkeleton />;

  if (firstError) {
    return <ErrorScreen error={firstError} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <TopBanner ad={featuredAds[0] || null} />

      <FeaturedSection featuredArticle={featuredArticle} sidebarAd={sidebarAd} />

      <div className="space-y-10 md:space-y-20">
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

        {remainingCategories.map((category, index) => {
          const articles = getCategorySlice(category.slug, false);
          const catIndex = categories.findIndex(c => c.slug === category.slug);
          const isLoadingCat = allQueries[catIndex]?.isLoading ?? false;

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

      <div ref={bottomSentinelRef} className="h-px w-full" />

      {renderDeferredFinalAd && <BottomAd ad={betweenAd} />}

      <NewsletterSection />
    </div>
  );
};

export default LandingPage;