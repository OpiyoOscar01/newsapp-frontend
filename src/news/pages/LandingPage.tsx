import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories, getArticlesByCategory } from '../data/mockData';
import { selectRandomAd, selectMultipleAds } from '../utils/randomAdSelector';
import {type Ad } from '../types';
import NewsCard from '../components/NewsCard';
import AdBanner from '../components/AdBanner';

const LandingPage: React.FC = () => {
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([]);
  const [sidebarAd, setSidebarAd] = useState<Ad | null>(null);

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

  // Advanced layout pattern system - creates unique visual rhythm for each category
  const getLayoutConfig = (index: number, articleCount: number) => {
    const layouts = [
      // Layout 1: Hero + Asymmetric Grid
      {
        name: 'hero-asymmetric',
        mobilePattern: 'large-then-grid',
        desktopStructure: 'hero-sidebar'
      },
      // Layout 2: Featured Wide + Triple Column
      {
        name: 'wide-triple',
        mobilePattern: 'alternating-sizes',
        desktopStructure: 'wide-columns'
      },
      // Layout 3: Magazine Grid + Sidebar
      {
        name: 'magazine-sidebar',
        mobilePattern: 'staggered-cards',
        desktopStructure: 'magazine-layout'
      },
      // Layout 4: Masonry + Compact Stack
      {
        name: 'masonry-stack',
        mobilePattern: 'large-small-rhythm',
        desktopStructure: 'masonry-style'
      },
      // Layout 5: Spotlight + Grid Flow
      {
        name: 'spotlight-flow',
        mobilePattern: 'featured-then-compact',
        desktopStructure: 'spotlight-grid'
      }
    ];
    
    return layouts[index % layouts.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Hero Section - Premium Welcome */}
      <section className="mb-10 md:mb-16">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="relative px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                Trusted by millions worldwide
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight tracking-tight">
                Stay Informed with{" "}
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  DefinePress
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-10 leading-relaxed">
                Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of global events.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  to="/category/world"
                  className="group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white text-gray-900 text-base md:text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explore World News
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/category/technology"
                  className="group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white/5 backdrop-blur-sm text-white text-base md:text-lg font-semibold rounded-xl border-2 border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  Tech Updates
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article Showcase */}
      {featuredArticle && (
        <section className="mb-10 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5 md:mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Featured Story
                  </h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
                </div>
              </div>
              <NewsCard 
                article={featuredArticle} 
                variant="hero" 
                priority="high"
              />
            </div>
            
            {/* Sidebar Ad */}
            <div className="lg:col-span-1">
              {sidebarAd && (
                <div className="sticky top-24">
                  <AdBanner ad={sidebarAd} placement="landing" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* First Banner Ad */}
      {featuredAds[0] && (
        <section className="mb-10 md:mb-16">
          <AdBanner ad={featuredAds[0]} placement="landing" />
        </section>
      )}

      {/* Dynamic Category Sections with Varied Layouts */}
      <div className="space-y-12 md:space-y-20">
        {categories.map((category, categoryIndex) => {
          const categoryArticles = getArticlesByCategory(category.slug, 4);
          
          if (categoryArticles.length === 0) return null;

          const layoutConfig = getLayoutConfig(categoryIndex, categoryArticles.length);
          const [firstArticle, secondArticle, ...remainingArticles] = categoryArticles;

          return (
            <section key={category.id} className="scroll-mt-20">
              
              {/* Category Header with Enhanced Design */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
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

              {/* Layout Pattern 1: Hero + Asymmetric Grid */}
              {layoutConfig.name === 'hero-asymmetric' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                  {/* Large hero card - mobile: full width, desktop: 2 cols */}
                  <div className="lg:col-span-2">
                    <NewsCard 
                      article={firstArticle} 
                      variant="large"
                      priority="high"
                    />
                  </div>
                  
                  {/* Stacked cards - mobile: 2-col grid, desktop: 1 col stack */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5">
                    {secondArticle && (
                      <NewsCard 
                        article={secondArticle} 
                        variant="compact"
                        orientation="horizontal"
                      />
                    )}
                    {remainingArticles.map((article, idx) => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        variant="compact"
                        orientation={idx === 0 ? 'horizontal' : 'vertical'}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Pattern 2: Featured Wide + Triple Column */}
              {layoutConfig.name === 'wide-triple' && (
                <div className="space-y-5 md:space-y-6">
                  {/* Full-width horizontal card */}
                  <div>
                    <NewsCard 
                      article={firstArticle} 
                      variant="wide"
                      priority="high"
                    />
                  </div>
                  
                  {/* Three-column grid - mobile: alternating sizes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {secondArticle && (
                      <div className="sm:col-span-2 lg:col-span-1">
                        <NewsCard 
                          article={secondArticle} 
                          variant="standard"
                        />
                      </div>
                    )}
                    {remainingArticles.map((article) => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        variant="standard"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Pattern 3: Magazine Grid + Sidebar */}
              {layoutConfig.name === 'magazine-sidebar' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 md:gap-6">
                  {/* Main magazine grid - mobile: stacked, desktop: 3 cols */}
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <NewsCard 
                        article={firstArticle} 
                        variant="medium"
                        priority="high"
                      />
                    </div>
                    {secondArticle && (
                      <NewsCard 
                        article={secondArticle} 
                        variant="medium"
                      />
                    )}
                    {remainingArticles.slice(0, 1).map((article) => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        variant="medium"
                      />
                    ))}
                  </div>
                  
                  {/* Sidebar - mobile: 2-col grid, desktop: 1 col */}
                  <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5">
                    {remainingArticles.slice(1).map((article) => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        variant="sidebar"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Pattern 4: Masonry + Compact Stack */}
              {layoutConfig.name === 'masonry-stack' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
                  {/* Large masonry card - mobile: full, desktop: 7 cols */}
                  <div className="lg:col-span-7">
                    <NewsCard 
                      article={firstArticle} 
                      variant="featured"
                      priority="high"
                    />
                  </div>
                  
                  {/* Compact cards - mobile: 2 cols, desktop: 5 cols stacked */}
                  <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5">
                    {secondArticle && (
                      <div className="col-span-2 lg:col-span-1">
                        <NewsCard 
                          article={secondArticle} 
                          variant="compact"
                          orientation="horizontal"
                        />
                      </div>
                    )}
                    {remainingArticles.map((article) => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        variant="mini"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Pattern 5: Spotlight + Grid Flow */}
              {layoutConfig.name === 'spotlight-flow' && (
                <div className="space-y-5 md:space-y-6">
                  {/* Spotlight hero */}
                  <div>
                    <NewsCard 
                      article={firstArticle} 
                      variant="spotlight"
                      priority="high"
                    />
                  </div>
                  
                  {/* Flowing grid - mobile: varied sizing, desktop: 3 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {secondArticle && (
                      <div className="sm:col-span-2 lg:col-span-1">
                        <NewsCard 
                          article={secondArticle} 
                          variant="standard"
                        />
                      </div>
                    )}
                    {remainingArticles.map((article, idx) => (
                      <div 
                        key={article.id}
                        className={idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
                      >
                        <NewsCard 
                          article={article} 
                          variant="standard"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Banner Ad Placement */}
              {categoryIndex === 2 && featuredAds[1] && (
                <div className="mt-10 md:mt-12">
                  <AdBanner ad={featuredAds[1]} placement="landing" />
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Premium Newsletter Section */}
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
                  className="px-6 md:px-8 py-3 md:py-4 bg-primary-600 text-white text-base font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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