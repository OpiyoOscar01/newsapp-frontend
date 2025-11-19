import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { categories, getArticlesByCategory, getFeaturedArticles } from '../data/dataService';
import { selectRandomAd, selectMultipleAds } from '../utils/randomAdSelector';
import { type Ad, type Article } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import Pagination from '../components/Pagination';
import CategoryNavigation from '../components/CategoryNavigation';
import './styles/landing.css';

const ARTICLES_PER_PAGE = 3; // Show 3 articles after the first one

const LandingPage: React.FC = () => {
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([]);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);
  const [categoryArticles, setCategoryArticles] = useState<Map<string, Article[]>>(new Map());
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination state for each category
  const [currentPages, setCurrentPages] = useState<Map<string, number>>(new Map());
  
  // Category navigation state
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

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
    
    const shuffled = [...layouts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load ads
        const bannerAds = selectMultipleAds('landing', 2, 'banner');
        const sidebar = selectRandomAd('landing', 'sidebar');
        setFeaturedAds(bannerAds);
        setSidebarAd(sidebar);

        // Load featured article
        try {
          const featured = await getFeaturedArticles();
          if (featured && featured.length > 0) {
            setFeaturedArticle(featured[0]);
          }
        } catch (error) {
          console.error('Failed to load featured article:', error);
        }

        // Load articles for each category
        const articlesMap = new Map();
        const pagesMap = new Map();
        
        for (const category of categories) {
          try {
            // Load more articles to support pagination
            const articles = await getArticlesByCategory(category.slug, 20); // Load more for pagination
            articlesMap.set(category.slug, Array.isArray(articles) ? articles : []);
            pagesMap.set(category.slug, 1); // Start each category at page 1
          } catch (error) {
            console.error(`Failed to load articles for category ${category.slug}:`, error);
            articlesMap.set(category.slug, []);
            pagesMap.set(category.slug, 1);
          }
        }
        
        setCategoryArticles(articlesMap);
        setCurrentPages(pagesMap);
      } catch (error) {
        console.error('Failed to load landing page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle page change for a specific category
  const handlePageChange = (categorySlug: string, page: number) => {
    setCurrentPages(prev => new Map(prev.set(categorySlug, page)));
  };

  // Handle category navigation
  const handleCategoryChange = (index: number) => {
    setCurrentCategoryIndex(index);
    // Scroll to the category section
    const categoryElement = document.querySelector(`[data-category="${categories[index].slug}"]`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get paginated articles for a category
  const getPaginatedArticles = (categorySlug: string): Article[] => {
    const articles = categoryArticles.get(categorySlug) || [];
    const currentPage = currentPages.get(categorySlug) || 1;
    
    if (articles.length <= 1) return articles;
    
    // First article is always shown, then paginate the rest
    const firstArticle = articles[0];
    const remainingArticles = articles.slice(1);
    
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    const paginatedRemaining = remainingArticles.slice(startIndex, endIndex);
    
    return [firstArticle, ...paginatedRemaining];
  };

  // Calculate total pages for a category
  const getTotalPages = (categorySlug: string): number => {
    const articles = categoryArticles.get(categorySlug) || [];
    if (articles.length <= 1) return 1;
    
    const remainingArticles = articles.length - 1;
    return Math.ceil(remainingArticles / ARTICLES_PER_PAGE);
  };

  // Dynamic layout configuration
  const getLayoutConfig = (index: number) => {
    const layoutName = randomLayoutOrder[index % randomLayoutOrder.length];
    
    const layoutMap: { [key: string]: any } = {
      'hero-asymmetric': {
        name: 'hero-asymmetric',
        description: 'Prominent hero story with secondary cards arranged asymmetrically.'
      },
      'wide-triple': {
        name: 'wide-triple',
        description: 'A cinematic wide headline article followed by a balanced three-column flow.'
      },
      'magazine-sidebar': {
        name: 'magazine-sidebar',
        description: 'Editorial-style grid with visual hierarchy and an adaptive sidebar for trending topics.'
      },
      'masonry-stack': {
        name: 'masonry-stack',
        description: 'Pinterest-inspired card stacking for high visual variation and content depth.'
      },
      'spotlight-flow': {
        name: 'spotlight-flow',
        description: 'Highlight key articles with spotlight emphasis and grid-based secondary flow.'
      },
      'alternating-media-text': {
        name: 'alternating-media-text',
        description: 'Visually rhythmic layout alternating image positions for a storytelling vibe.'
      },
      'carousel-grid': {
        name: 'carousel-grid',
        description: 'Horizontal swipeable carousel on mobile, expanding into a multi-row grid on desktop.'
      },
      'editorial-split': {
        name: 'editorial-split',
        description: 'Newspaper-style split view with a pull quote or featured text area to break repetition.'
      },
      'timeline-feed': {
        name: 'timeline-feed',
        description: 'Chronological feed emphasizing publication dates and linear storytelling.'
      },
      'visual-mosaic': {
        name: 'visual-mosaic',
        description: 'Highly visual, image-dominant layout resembling a photo journal or artboard.'
      }
    };

    return layoutMap[layoutName];
  };

  // Safe article destructuring
  const getArticlesForLayout = (articles: Article[]) => {
    if (!Array.isArray(articles) || articles.length === 0) {
      return { firstArticle: null, secondArticle: null, remainingArticles: [] };
    }
    
    const [firstArticle, secondArticle, ...remainingArticles] = articles;
    return { firstArticle, secondArticle, remainingArticles };
  };

  // Render layout component
  const renderCategoryLayout = (layoutConfig: any, articles: Article[]) => {
    const { firstArticle, secondArticle, remainingArticles } = getArticlesForLayout(articles);
    
    if (!firstArticle) {
      return (
        <div className="text-center py-8 text-gray-500">
          No articles available for this category.
        </div>
      );
    }

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
        // Default layout
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

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="animate-pulse">
          {/* Featured section skeleton */}
          <div className="mb-10 md:mb-12 -mx-4 sm:mx-7">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Categories skeleton */}
          <div className="space-y-10 md:space-y-20">
            {categories.map((category, index) => (
              <div key={category.id} className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Featured Article Showcase */}
      {featuredArticle && (
        <section className="mb-10 md:mb-12 -mx-4 sm:mx-0">
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
            
            {/* Sidebar Ad */}
            <div className="px-4 sm:px-0">
              {sidebarAd && (
                <div className="sticky top-24">
                  <div className="bg-gray-50 rounded-lg p-1 border-2 border-gray-200">
                    <AdBanner ad={sidebarAd} placement="landing" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Banner Ad 1 */}
      {featuredAds[0] && (
        <section className="mb-10 md:mb-16">
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg border-2 border-gray-200">
            <AdBanner ad={featuredAds[0]} placement="landing" />
          </div>
        </section>
      )}

      {/* Category Navigation */}
      {categories.length > 1 && (
        <section className="mb-8">
          <CategoryNavigation
            categories={categories}
            currentCategoryIndex={currentCategoryIndex}
            onCategoryChange={handleCategoryChange}
          />
        </section>
      )}

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
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                          {category.name}
                        </h2>
                        <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                          {categoryArticles.get(category.slug)?.length || 0} articles
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
                    </div>
                    <Link
                      to={`/category/${category.slug}`}
                      className="group flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold text-sm md:text-base transition-colors"
                    >
                      <span>Explore all</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Category Content */}
                  <div className="w-full mb-8">
                    {renderCategoryLayout(layoutConfig, paginatedArticles)}
                  </div>

                  {/* Pagination */}
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

              {/* Banner Ad 2 after 3rd category */}
              {categoryIndex === 2 && featuredAds[1] && (
                <section className="w-full my-10 md:my-12">
                  <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-1 border-2 border-gray-200">
                    <AdBanner ad={featuredAds[1]} placement="landing" />
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