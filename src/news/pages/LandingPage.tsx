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
    // Load random ads for different placements
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
//kk
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
     <section className="mb-12">
  <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-black rounded-2xl p-8 md:p-12 text-white shadow-xl">
    <div className="max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
        Stay Informed with{" "}
        <span className="text-white/80">DefinePress.</span>
      </h1>
      <p className="text-lg md:text-2xl text-white/70 mb-8">
        Your trusted source for breaking news, in-depth analysis, and
        comprehensive coverage of global events.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/category/world"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-gray-900 bg-white hover:bg-gray-200 transition-all duration-200"
        >
          Explore World News
        </Link>
        <Link
          to="/category/technology"
          className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-semibold rounded-md text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
        >
          Tech Updates
        </Link>
      </div>
    </div>
  </div>
</section>



      {/* Featured Article */}
      {featuredArticle && (
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Story</h2>
                <div className="w-12 h-1 bg-primary-600 rounded"></div>
              </div>
              <NewsCard article={featuredArticle} size="large" />
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
        <section className="mb-12">
          <AdBanner ad={featuredAds[0]} placement="landing" />
        </section>
      )}

      {/* Category Sections */}
      <div className="space-y-12">
        {categories.map((category, index) => {
          const categoryArticles = getArticlesByCategory(category.slug, 4);
          
          if (categoryArticles.length === 0) return null;

          return (
            <section key={category.id} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                    {category.name}
                  </h2>
                  <div className="w-12 h-1 bg-primary-600 rounded"></div>
                </div>
                <Link
                  to={`/category/${category.slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                >
                  <span className="text-blue-500">View All in {category.name} News</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    size="medium"
                    showImage={true}
                  />
                ))}
              </div>

              {/* Second Banner Ad after 3rd category */}
              {index === 2 && featuredAds[1] && (
                <div className="mt-8">
                  <AdBanner ad={featuredAds[1]} placement="landing" />
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Newsletter Signup */}
      <section className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest news delivered straight to your inbox. No spam, just quality journalism.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            By subscribing, you agree to our privacy policy and terms of service.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;