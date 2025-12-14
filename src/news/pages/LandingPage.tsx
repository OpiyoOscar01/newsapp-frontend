import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../data/dataService';
import { selectRandomAd, selectMultipleAds } from '../utils/randomAdSelector';
import { type Ad, type Article, type Category } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
// import CategoryNavigation from '../components/CategoryNavigation';
import { LandingPageSkeleton, } from '../components/LoadingSkeletons';
import './styles/landing.css';
import { trackVisitor } from '../utils/visitorTracking';

const ARTICLES_PER_PAGE = 3;

const LandingPage: React.FC = () => {
    useEffect(() => {
    trackVisitor();
  }, []);
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([]);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [categoryAds, setCategoryAds] = useState<Ad[]>([]); // New state for category ads
  const [categoryArticles, setCategoryArticles] = useState<Map<string, Article[]>>(new Map());
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPages, setCurrentPages] = useState<Map<string, number>>(new Map());
  // const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Generate random layout order
  const randomLayoutOrder = useMemo(() => {
    const layouts = [
      'hero-asymmetric',
      'wide-triple',
      'magazine-sidebar',
      'masonry-stack',
      'spotlight-flow',
      'alternating-media-text',
      'carousel-grid',
      'editorial-split',
      'timeline-feed',
      'visual-mosaic'
    ];
    
    return layouts.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load 3 ads total: 2 banner ads + 1 sidebar ad + 1 category ad
      const bannerAds = selectMultipleAds('landing', 2, 'banner');
      const sidebar = selectRandomAd('landing', 'sidebar');
      const categoryAd = selectRandomAd('landing', 'sidebar'); // New category ad
      
      setFeaturedAds(bannerAds);
      setSidebarAd(sidebar);
        if (categoryAd) {
          setCategoryAds([categoryAd]);
        } else {
          setCategoryAds([]); // or leave previous value
        }

      // Load categories first
      const categoriesData = await dataService.getCategories();
      if (!categoriesData || categoriesData.length === 0) {
        throw new Error('No categories available');
      }
      setCategories(categoriesData);

      // Load featured article
      try {
        const featured = await dataService.getFeaturedArticles();
        if (featured && featured.length > 0) {
          setFeaturedArticle(featured[0]);
        }
      } catch (err) {
        console.warn('Failed to load featured article:', err);
      }

      // Load articles for each category
      const articlesMap = new Map<string, Article[]>();
      const pagesMap = new Map<string, number>();
      
      await Promise.all(
        categoriesData.map(async (category) => {
          try {
            const articles = await dataService.getArticlesByCategory(category.slug, 20);
            articlesMap.set(category.slug, articles);
            pagesMap.set(category.slug, 1);
          } catch (err) {
            console.error(`Failed to load articles for ${category.slug}:`, err);
            articlesMap.set(category.slug, []);
            pagesMap.set(category.slug, 1);
          }
        })
      );
      
      setCategoryArticles(articlesMap);
      setCurrentPages(pagesMap);
    } catch (err) {
      console.error('Failed to load landing page data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (categorySlug: string, page: number) => {
    setCurrentPages(prev => new Map(prev.set(categorySlug, page)));
    const categoryElement = document.querySelector(`[data-category="${categorySlug}"]`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // const handleCategoryChange = (index: number) => {
  //   setCurrentCategoryIndex(index);
  //   const categoryElement = document.querySelector(`[data-category="${categories[index].slug}"]`);
  //   if (categoryElement) {
  //     categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  const getPaginatedArticles = (categorySlug: string): Article[] => {
    const articles = categoryArticles.get(categorySlug) || [];
    const currentPage = currentPages.get(categorySlug) || 1;
    
    if (articles.length <= 1) return articles;
    
    const firstArticle = articles[0];
    const remainingArticles = articles.slice(1);
    
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    const paginatedRemaining = remainingArticles.slice(startIndex, endIndex);
    
    return [firstArticle, ...paginatedRemaining];
  };

  const getTotalPages = (categorySlug: string): number => {
    const articles = categoryArticles.get(categorySlug) || [];
    if (articles.length <= 1) return 1;
    
    const remainingArticles = articles.length - 1;
    return Math.ceil(remainingArticles / ARTICLES_PER_PAGE);
  };

  const getLayoutConfig = (index: number) => {
    const layoutName = randomLayoutOrder[index % randomLayoutOrder.length];
    return { name: layoutName };
  };

  const renderCategoryLayout = (layoutConfig: any, articles: Article[]) => {
    if (!articles || articles.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No articles available for this category.
        </div>
      );
    }

    const [firstArticle, secondArticle, ...remainingArticles] = articles;

    switch(layoutConfig.name) {
      case 'hero-asymmetric':
        return (
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-5 lg:gap-6">
            <div className="lg:col-span-2">
              <NewsCard 
                article={firstArticle} 
                variant="large" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>
            <div className="space-y-3 md:space-y-5 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-1">
              {secondArticle && (
                <NewsCard 
                  article={secondArticle} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
              {remainingArticles.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              ))}
            </div>
          </div>
        );

      case 'wide-triple':
        return (
          <div className="space-y-3 md:space-y-5 lg:space-y-6">
            <div>
              <NewsCard 
                article={firstArticle} 
                variant="wide" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-6">
              {secondArticle && (
                <div className="md:col-span-2 lg:col-span-1">
                  <NewsCard 
                    article={secondArticle} 
                    variant="compact" 
                    orientation="horizontal"
                    isFirstInCategory={false}
                    hideMetaMobile={true}
                    showCategory={true}
                  />
                </div>
              )}
              {remainingArticles.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-6">
            <div className="lg:col-span-2">
              <NewsCard 
                article={firstArticle} 
                variant="large" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>
            <div className="space-y-3 md:space-y-5 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-1">
              {secondArticle && (
                <NewsCard 
                  article={secondArticle} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
              {remainingArticles.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <LandingPageSkeleton />;
  }

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
      {/* Ad 1: Top Banner Ad */}
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

      {/* Featured Article Showcase */}
      {featuredArticle && (
        <section className="mb-10 md:mb-16 -mx-4 sm:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Featured
                  </h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
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
            
            {/* Ad 2: Sidebar Ad (Desktop) / Inline Ad (Mobile) */}
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

      {/* Category Navigation */}
      {/* {categories.length > 1 && (
        <section className="mb-8">
          <CategoryNavigation
            categories={categories}
            currentCategoryIndex={currentCategoryIndex}
            onCategoryChange={handleCategoryChange}
          />
        </section>
      )} */}

      {/* Category Sections */}
      <div className="space-y-10 md:space-y-20">
        {categories.map((category, categoryIndex) => {
          const paginatedArticles = getPaginatedArticles(category.slug);
          const totalPages = getTotalPages(category.slug);
          const currentPage = currentPages.get(category.slug) || 1;
          
          if (paginatedArticles.length === 0) return null;

          const layoutConfig = getLayoutConfig(categoryIndex);

          return (
            <React.Fragment key={category.id}>
              <section 
                className="scroll-mt-20"
                data-category={category.slug}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between mb-8">
              
              {/* Category title */}
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                  {category.name}
                </h2>

                <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  {categoryArticles.get(category.slug)?.length || 0} articles
                </span>
              </div>

              {/* Explore all */}
              <Link
                to={`/category/${category.slug}`}
                className="group flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold text-sm md:text-base transition-colors"
              >
                <span className="inline-block text-blue-500 underline whitespace-nowrap sm:mb-3">
                  Explore all
                </span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Optional underline below title */}
            <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>


                  <div className="w-full mb-8">
                    {renderCategoryLayout(layoutConfig, paginatedArticles)}
                  </div>

                  {/* Ad 3: Middle Category Ad (appears after first category on mobile, in the middle on desktop) */}
                  {categoryIndex === 0 && categoryAds[0] && (
                    <div className="my-8 md:my-12">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        <div className="lg:col-span-2">
                          <div className="bg-gradient-to-r from-gray-50 to-primary-50/30 rounded-lg p-2 border-2 border-gray-200">
                            <AdBanner 
                              ad={categoryAds[0]} 
                              placement="inline" 
                              size="leaderboard"
                              className="min-h-[100px] md:min-h-[120px]"
                            />
                          </div>
                        </div>
                        <div className="text-center lg:text-left">
                          <p className="text-sm text-gray-600">
                            Sponsored content helps support our journalism
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => handlePageChange(category.slug, page)}
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Legacy Banner Ad 2 placement (kept for compatibility) */}
              {categoryIndex === 2 && featuredAds[1] && (
                <section className="w-full my-10 md:my-12">
                  <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-2 border-2 border-gray-200">
                    <AdBanner 
                      ad={featuredAds[1]} 
                      placement="landing" 
                      size="leaderboard"
                      className="min-h-[90px] md:min-h-[120px]"
                    />
                  </div>
                </section>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Newsletter Section */}
      <section className="mt-16 md:mt-24">
        <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50/30 rounded-3xl overflow-hidden shadow-xl border border-primary-100">
          <div className="absolute inset-0 bg-grid-primary/[0.03] bg-[size:20px_20px]"></div>
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
                By subscribing, you agree to our <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;