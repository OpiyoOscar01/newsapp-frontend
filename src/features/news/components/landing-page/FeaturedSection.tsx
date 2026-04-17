import React from 'react';
import type { Ad } from '../../../../news/types';
import type { Article as AppArticle }  from '../../../../news/types';
import AdBanner from '../../../../news/components/AdBanner';
import NewsCard from '../../../../news/components/NewsCard';
interface FeaturedSectionProps {
  featuredArticle: AppArticle | null;
  sidebarAd: Ad | null;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ featuredArticle, sidebarAd }) => {
  if (!featuredArticle) return null;

  return (
    <section className="mb-10 md:mb-16 -mx-4 sm:mx-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
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
  );
};

export default FeaturedSection;