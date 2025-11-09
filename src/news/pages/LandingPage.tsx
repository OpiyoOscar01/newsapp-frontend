import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { categories, getArticlesByCategory } from '../data/mockData';
import { selectRandomAd, selectMultipleAds } from '../utils/randomAdSelector';
import {type Ad } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';
import './styles/landing.css';

const LandingPage: React.FC = () => {
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([]);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);

  // Generate random layout order on component mount (persists during session)
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
    
    // Fisher-Yates shuffle algorithm for true randomization
    const shuffled = [...layouts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }, []); // Empty dependency array ensures this runs only once per page load

  useEffect(() => {
    const bannerAds = selectMultipleAds('landing', 2, 'banner');
    const sidebar = selectRandomAd('landing', 'sidebar');
    
    setFeaturedAds(bannerAds);
    setSidebarAd(sidebar);
  }, []);

  const getFeaturedArticle = () => {
    const techArticles = getArticlesByCategory('technology', 1);
    return techArticles[0];
  };

  const featuredArticle = getFeaturedArticle();

  // Dynamic layout configuration with randomized order
  const getLayoutConfig = (index: number) => {
    const layoutName = randomLayoutOrder[index % randomLayoutOrder.length];
    
    const layoutMap: { [key: string]: any } = {
      'hero-asymmetric': {
        name: 'hero-asymmetric',
        mobilePattern: 'large-then-grid',
        desktopStructure: 'hero-sidebar',
        description: 'Prominent hero story with secondary cards arranged asymmetrically.'
      },
      'wide-triple': {
        name: 'wide-triple',
        mobilePattern: 'alternating-sizes',
        desktopStructure: 'wide-columns',
        description: 'A cinematic wide headline article followed by a balanced three-column flow.'
      },
      'magazine-sidebar': {
        name: 'magazine-sidebar',
        mobilePattern: 'staggered-cards',
        desktopStructure: 'magazine-layout',
        description: 'Editorial-style grid with visual hierarchy and an adaptive sidebar for trending topics.'
      },
      'masonry-stack': {
        name: 'masonry-stack',
        mobilePattern: 'large-small-rhythm',
        desktopStructure: 'masonry-style',
        description: 'Pinterest-inspired card stacking for high visual variation and content depth.'
      },
      'spotlight-flow': {
        name: 'spotlight-flow',
        mobilePattern: 'featured-then-compact',
        desktopStructure: 'spotlight-grid',
        description: 'Highlight key articles with spotlight emphasis and grid-based secondary flow.'
      },
      'alternating-media-text': {
        name: 'alternating-media-text',
        mobilePattern: 'image-left-then-right',
        desktopStructure: 'staggered-columns',
        description: 'Visually rhythmic layout alternating image positions for a storytelling vibe.'
      },
      'carousel-grid': {
        name: 'carousel-grid',
        mobilePattern: 'horizontal-scroll',
        desktopStructure: 'carousel-plus-grid',
        description: 'Horizontal swipeable carousel on mobile, expanding into a multi-row grid on desktop.'
      },
      'editorial-split': {
        name: 'editorial-split',
        mobilePattern: 'stacked-cards',
        desktopStructure: 'split-grid-with-quote',
        description: 'Newspaper-style split view with a pull quote or featured text area to break repetition.'
      },
      'timeline-feed': {
        name: 'timeline-feed',
        mobilePattern: 'chronological-scroll',
        desktopStructure: 'dual-timeline-columns',
        description: 'Chronological feed emphasizing publication dates and linear storytelling.'
      },
      'visual-mosaic': {
        name: 'visual-mosaic',
        mobilePattern: 'adaptive-tile-flow',
        desktopStructure: 'mosaic-grid',
        description: 'Highly visual, image-dominant layout resembling a photo journal or artboard.'
      }
    };

    return layoutMap[layoutName];
  };

  // Render layout component based on config with enhanced responsiveness
  const renderCategoryLayout = (layoutConfig: any, firstArticle: any, secondArticle: any, remainingArticles: any[]) => {
    switch(layoutConfig.name) {
      case 'hero-asymmetric':
        return (
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-5 lg:gap-6">
            {/* Item 1: Full metadata on all screens */}
            <div className="lg:col-span-2">
              <NewsCard 
                article={firstArticle} 
                variant="large" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>
            {/* Items 2-4: Hide metadata on mobile, show on desktop */}
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
                    className="md:h-full" 
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
                  className="md:h-full" 
                />
              ))}
            </div>
          </div>
        );

      case 'magazine-sidebar':
        return (
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-4 md:gap-5 lg:gap-6">
            <div className="space-y-3 md:space-y-5 lg:col-span-3 md:grid md:grid-cols-2 md:gap-5">
              <div className="md:col-span-2 lg:col-span-1">
                <NewsCard 
                  article={firstArticle} 
                  variant="medium" 
                  priority="high"
                  isFirstInCategory={true}
                  showCategory={true}
                />
              </div>
              {secondArticle && (
                <NewsCard 
                  article={secondArticle} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                  className="md:h-full" 
                />
              )}
              {remainingArticles.slice(0, 1).map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                  className="md:h-full" 
                />
              ))}
            </div>
            <div className="space-y-3 md:space-y-5 md:grid md:grid-cols-2 md:gap-5 lg:col-span-1 lg:grid-cols-1">
              {remainingArticles.slice(1).map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="sidebar"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              ))}
            </div>
          </div>
        );

      case 'masonry-stack':
        return (
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-12 md:gap-5 lg:gap-6">
            <div className="lg:col-span-7">
              <NewsCard 
                article={firstArticle} 
                variant="featured" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>
            <div className="space-y-3 md:space-y-5 lg:col-span-5 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-1">
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
                  className="md:hidden lg:block" 
                />
              ))}
              {remainingArticles.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="mini"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                  className="hidden md:block lg:hidden" 
                />
              ))}
            </div>
          </div>
        );

      case 'spotlight-flow':
        return (
          <div className="space-y-3 md:space-y-5 lg:space-y-6">
            <div>
              <NewsCard 
                article={firstArticle} 
                variant="spotlight" 
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
                    className="md:h-full" 
                  />
                </div>
              )}
              {remainingArticles.map((article, idx) => (
                <div key={article.id} className={idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}>
                  <NewsCard 
                    article={article} 
                    variant="compact" 
                    orientation="horizontal"
                    isFirstInCategory={false}
                    hideMetaMobile={true}
                    showCategory={true}
                    className="md:h-full" 
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'alternating-media-text':
        return (
          <div className="space-y-3 md:space-y-5 lg:space-y-6">
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-5 lg:gap-6">
              <NewsCard 
                article={firstArticle} 
                variant="medium" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
              {secondArticle && (
                <NewsCard 
                  article={secondArticle} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                  className="md:h-full" 
                />
              )}
            </div>
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-5 lg:gap-6">
              {remainingArticles.map((article) => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                  className="md:h-full" 
                />
              ))}
            </div>
          </div>
        );

      case 'carousel-grid':
        return (
          <div className="space-y-3 md:space-y-5 lg:space-y-6">
            <div className="md:hidden">
              <NewsCard 
                article={firstArticle} 
                variant="large" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>
            <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible scrollbar-hide md:grid md:grid-cols-2 md:gap-5 lg:gap-6">
              <div className="w-80 flex-shrink-0 md:w-auto md:hidden">
                {secondArticle && (
                  <NewsCard 
                    article={secondArticle} 
                    variant="large"
                    isFirstInCategory={false}
                    hideMetaMobile={true}
                    showCategory={true}
                  />
                )}
              </div>
              <div className="hidden md:block">
                <NewsCard 
                  article={firstArticle} 
                  variant="large" 
                  priority="high"
                  isFirstInCategory={true}
                  showCategory={true}
                />
              </div>
              {secondArticle && (
                <div className="hidden md:block">
                  <NewsCard 
                    article={secondArticle} 
                    variant="large"
                    isFirstInCategory={false}
                    showCategory={true}
                  />
                </div>
              )}
            </div>
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 lg:gap-5">
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

      case 'editorial-split':
        return (
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-5 lg:gap-6">
            <div className="space-y-3 md:space-y-5">
              <NewsCard 
                article={firstArticle} 
                variant="featured" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
              {remainingArticles[0] && (
                <NewsCard 
                  article={remainingArticles[0]} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
            </div>
            <div className="space-y-3 md:space-y-5">
              {secondArticle && (
                <NewsCard 
                  article={secondArticle} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                  className="md:h-auto" 
                />
              )}
              {remainingArticles[1] && (
                <NewsCard 
                  article={remainingArticles[1]} 
                  variant="compact" 
                  orientation="horizontal"
                  isFirstInCategory={false}
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
            </div>
          </div>
        );

      case 'timeline-feed':
        return (
          <div className="space-y-3 md:space-y-5">
            {[firstArticle, secondArticle, ...remainingArticles].filter(Boolean).map((article, idx) => (
              <div key={article!.id} className={idx === 0 ? '' : 'border-t border-gray-200 pt-3 md:pt-5'}>
                <NewsCard 
                  article={article!} 
                  variant={idx === 0 ? 'wide' : 'compact'} 
                  orientation="horizontal" 
                  priority={idx === 0 ? 'high' : 'normal'}
                  isFirstInCategory={idx === 0}
                  hideMetaMobile={idx > 0}
                  showCategory={true}
                />
              </div>
            ))}
          </div>
        );

      case 'visual-mosaic':
        return (
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-3 lg:gap-4">
            <div className="md:col-span-2 md:row-span-2">
              <NewsCard 
                article={firstArticle} 
                variant="large" 
                priority="high"
                isFirstInCategory={true}
                showCategory={true}
              />
            </div>
            <div className="space-y-3 md:space-y-0 md:contents">
              {secondArticle && (
                <div className="md:col-span-1">
                  <NewsCard 
                    article={secondArticle} 
                    variant="compact" 
                    orientation="horizontal"
                    isFirstInCategory={false}
                    hideMetaMobile={true}
                    showCategory={true}
                    className="md:h-full" 
                  />
                </div>
              )}
              {remainingArticles.map((article) => (
                <div key={article.id} className="md:col-span-1">
                  <NewsCard 
                    article={article} 
                    variant="compact" 
                    orientation="horizontal"
                    isFirstInCategory={false}
                    hideMetaMobile={true}
                    showCategory={true}
                    className="md:h-full" 
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Featured Article Showcase - Edge-to-edge on mobile */}
      {featuredArticle && (
        <section className="mb-10 md:mb-16 -mx-4 sm:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5 md:mb-6 px-4 sm:px-0">
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
            
            {/* FIXED SIDEBAR AD - Protected from layout randomization */}
            <div className="lg:col-span-1 px-4 sm:px-0">
              {sidebarAd && (
                <div className="sticky top-24 z-30">
                  <div className="bg-gray-50 rounded-lg p-1 border-2 border-gray-200">
                    <AdBanner ad={sidebarAd} placement="landing" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FIXED BANNER AD 1 - Protected from layout randomization */}
      {featuredAds[0] && (
        <section className="mb-10 md:mb-16 relative z-30">
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-1 border-2 border-gray-200">
            <AdBanner ad={featuredAds[0]} placement="landing" />
          </div>
        </section>
      )}

      {/* DYNAMIC CATEGORY SECTIONS - Each in isolated container */}
      <div className="space-y-10 md:space-y-20">
        {categories.map((category, categoryIndex) => {
          const categoryArticles = getArticlesByCategory(category.slug, 4);
          
          if (categoryArticles.length === 0) return null;

          const layoutConfig = getLayoutConfig(categoryIndex);
          const [firstArticle, secondArticle, ...remainingArticles] = categoryArticles;

          return (
            <React.Fragment key={category.id}>
              {/* Each category in its own isolated section container */}
              <section 
                className="scroll-mt-20 relative z-10 overflow-hidden"
                data-category={category.slug}
              >
                {/* Category container with clear boundaries */}
                <div className="w-full">
                  
                  {/* Category Header with Enhanced Design */}
                  <div className="flex items-center justify-between mb-5 md:mb-8">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                          {category.name}
                        </h2>
                        <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                          {categoryArticles.length} articles
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
                    </div>
                    <Link
                      to={`/category/${category.slug}`}
                      className="group flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold text-sm md:text-base transition-colors"
                    >
                      <span>View all</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Category Content - Isolated layout container */}
                  <div className="w-full clear-both">
                    {renderCategoryLayout(layoutConfig, firstArticle, secondArticle, remainingArticles)}
                  </div>

                </div>
              </section>

              {/* FIXED BANNER AD 2 - After 3rd category, in separate container */}
              {categoryIndex === 2 && featuredAds[1] && (
                <section className="relative z-30 w-full my-10 md:my-12">
                  <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-1 border-2 border-gray-200">
                    <AdBanner ad={featuredAds[1]} placement="landing" />
                  </div>
                </section>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Premium Newsletter Section (FIXED - No Randomization) */}
      <section className="mt-16 md:mt-24 relative z-10">
        <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50/30 rounded-3xl overflow-hidden shadow-xl border border-primary-100">
          <div className="absolute inset-0 bg-grid-primary/[0.03] bg-[size:20px_20px]"></div>
          <div className="relative px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Join 50,000+ subscribers</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                Never Miss a Story
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed">
                Get the latest news, exclusive insights, and curated content delivered straight to your inbox. No spam, just quality journalism.
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
                  className="px-6 md:px-8 py-3 md:py-4 bg-primary-600 text-gray-900 text-base font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="text-xs sm:text-sm text-gray-500 mt-5 md:mt-6">
                By subscribing, you agree to our <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> and <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;