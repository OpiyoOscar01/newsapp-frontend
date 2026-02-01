import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { dataService } from "../data/dataService";
import { selectMultipleAds, selectRandomAd } from "../utils/randomAdSelector";
import { type Ad, type Article, type Category } from "../types";
import NormalContainer from "../components/landing/NormalContainer";
import BigContainer from "../components/landing/BigContainer";
import AdBanner from "../components/AdBanner";
import { LandingPageSkeleton } from "../components/LoadingSkeletons";
import "./styles/landing.css";
import { trackVisitor } from "../utils/visitorTracking";
import NewsCard from "../components/NewsCard";

const MOBILE_ITEMS_PER_CATEGORY = 6;
const DESKTOP_BIG_ITEMS = 4;
const DESKTOP_NORMAL_ITEMS = 5;

const LandingPage: React.FC = () => {
  useEffect(() => {
    trackVisitor();
  }, []);

  const [featuredAds, setFeaturedAds] = useState<Ad[]>([]);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [betweenCategoriesAdPool, setBetweenCategoriesAdPool] = useState<Ad[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<Map<string, Article[]>>(new Map());
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // "First ad that comes after the big container" => we will render it LAST.
  const [renderDeferredFinalAd, setRenderDeferredFinalAd] = useState(false);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  const betweenAd = useMemo(() => {
    return betweenCategoriesAdPool[0] ?? featuredAds[1] ?? null;
  }, [betweenCategoriesAdPool, featuredAds]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!bottomSentinelRef.current) return;

    const el = bottomSentinelRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        const any = entries.some((e) => e.isIntersecting);
        if (any) {
          setRenderDeferredFinalAd(true);
          obs.disconnect();
        }
      },
      { rootMargin: "800px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [loading]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const bannerAds = selectMultipleAds("landing", 2, "banner");
      const sidebar = selectRandomAd("landing", "sidebar");
      const betweenPool = selectMultipleAds("landing", 2, "banner");

      setFeaturedAds(bannerAds);
      setSidebarAd(sidebar);
      setBetweenCategoriesAdPool(betweenPool);

      const categoriesData = await dataService.getCategories();
      if (!categoriesData || categoriesData.length === 0) {
        throw new Error("No categories available");
      }
      setCategories(categoriesData);

      try {
        const featured = await dataService.getFeaturedArticles();
        if (featured && featured.length > 0) setFeaturedArticle(featured[0]);
      } catch (err) {
        console.warn("Failed to load featured article:", err);
      }

      const articlesMap = new Map<string, Article[]>();
      await Promise.all(
        categoriesData.map(async (category) => {
          try {
            const articles = await dataService.getArticlesByCategory(category.slug, 20);
            articlesMap.set(category.slug, articles);
          } catch (err) {
            console.error(`Failed to load articles for ${category.slug}:`, err);
            articlesMap.set(category.slug, []);
          }
        })
      );

      setCategoryArticles(articlesMap);
    } catch (err) {
      console.error("Failed to load landing page data:", err);
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const getCategorySlice = (slug: string, isBig: boolean) => {
    const list = categoryArticles.get(slug) ?? [];
    const want = isBig
      ? Math.max(DESKTOP_BIG_ITEMS, MOBILE_ITEMS_PER_CATEGORY)
      : Math.max(DESKTOP_NORMAL_ITEMS, MOBILE_ITEMS_PER_CATEGORY);
    return list.slice(0, want);
  };

  const generalCategory = categories.find((c) => c.slug === "general") ?? categories[0];
  const remainingCategories = categories.filter((c) => c.id !== generalCategory?.id);

  if (loading) return <LandingPageSkeleton />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to Load Content</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={loadData}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Top Banner */}
      {featuredAds[0] && (
        <section className="mb-8 md:mb-12">
          <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-1 border-2 border-gray-200">
            <AdBanner ad={featuredAds[0]} placement="banner" size="leaderboard" className="min-h-[90px] md:min-h-[120px]" />
          </div>
        </section>
      )}

      {/* Featured Article + Sidebar Ad */}
      {featuredArticle && (
        <section className="mb-10 md:mb-16 -mx-4 sm:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured</h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />
                </div>
              </div>

              <NewsCard
                article={featuredArticle}
                variant="hero"
                priority="high"
                isFeaturedHero={true}
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>

            {sidebarAd && (
              <div className="px-4 sm:px-0">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-gray-50 rounded-lg p-2 border-2 border-gray-200">
                    <div className="hidden lg:block">
                      <AdBanner ad={sidebarAd} placement="sidebar" size="medium-rectangle" className="min-h-[250px]" />
                    </div>
                    <div className="lg:hidden">
                      <AdBanner ad={sidebarAd} placement="inline" size="banner" className="min-h-[100px]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Category Sections */}
      <div className="space-y-10 md:space-y-20">
        {/* BIG (general) */}
        {generalCategory && (
          <section className="scroll-mt-20" data-category={generalCategory.slug}>
            <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                    {generalCategory.name}
                  </h2>
                  <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    {categoryArticles.get(generalCategory.slug)?.length || 0} articles
                  </span>
                </div>
              </div>

              <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />

              <div className="w-full mt-8">
                <BigContainer
                  articles={getCategorySlice(generalCategory.slug, true)}
                  exploreHref={`/category/${generalCategory.slug}`}
                  sidebarAd={selectRandomAd("landing", "sidebar")}
                  showAdHelperText={false}
                />
              </div>
            </div>
          </section>
        )}

        {/* NORMAL containers (NO explore-all links in headers anymore) */}
        {remainingCategories.map((category) => {
          const articles = getCategorySlice(category.slug, false);
          if (articles.length === 0) return null;

          return (
            <section key={category.id} className="scroll-mt-20" data-category={category.slug}>
              <div className="w-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                      {category.name}
                    </h2>
                    <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                      {categoryArticles.get(category.slug)?.length || 0} articles
                    </span>
                  </div>
                </div>

                <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />

                <div className="w-full mt-8">
                  <NormalContainer articles={articles} exploreHref={`/category/${category.slug}`} />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Sentinel used to trigger deferred final ad */}
      <div ref={bottomSentinelRef} className="h-px w-full" />

      {/* Deferred: first after-big-container banner ad rendered LAST */}
      {renderDeferredFinalAd && betweenAd && (
        <section className="w-full my-10 md:my-12">
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-2 border-2 border-gray-200">
            <AdBanner ad={betweenAd} placement="landing" size="leaderboard" className="min-h-[90px] md:min-h-[120px]" />
          </div>
        </section>
      )}

      {/* Newsletter Section (unchanged) */}
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

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">Never Miss a Story</h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Get the latest news and exclusive insights delivered straight to your inbox.
              </p>

              <form className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-5 md:px-6 py-3 md:py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 md:px-8 py-3 md:py-4 bg-primary-600 text-white text-base font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Subscribe
                </button>
              </form>

              <p className="text-sm text-gray-500 mt-6">
                By subscribing, you agree to our{" "}
                <Link to="/privacy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
