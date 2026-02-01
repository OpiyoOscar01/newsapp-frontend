import React from "react";
import { type Article, type Ad } from "../../types";
import AdBanner from "../AdBanner";
import NewsCard from "../NewsCard";

type BigContainerProps = {
  articles: Article[];
  exploreHref: string;
  sidebarAd?: Ad | null;
  showAdHelperText?: boolean;
};

const BigContainer: React.FC<BigContainerProps> = ({
  articles,
  exploreHref,
  sidebarAd,
  showAdHelperText = false,
}) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No articles available for this category.
      </div>
    );
  }

  // Based on the image: Main card (left), side ad (top-right), and 3 cards in bottom row
  const main = articles[0];
  const rightTop = articles[1];
  const bottomLeft = articles[2];
  const bottomMid = articles[3];
  const bottomRight = articles[4];
  const mobile5 = articles[5];

  return (
    <div className="w-full">
      {/* Desktop grid - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* MAIN CARD - spans 2 columns, row 1 */}
        <div className="lg:col-span-2">
          <NewsCard
            article={main}
            variant="large"
            priority="high"
            isFirstInCategory={true}
            showCategory={true}
          />
        </div>

        {/* SIDE AD - column 3, row 1 */}
        {sidebarAd && (
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-2 border-2 border-gray-200 h-full">
              <AdBanner
                ad={sidebarAd}
                placement="sidebar"
                size="medium-rectangle"
                className="h-full min-h-[220px]"
              />
              {showAdHelperText && (
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Sponsored content helps support our journalism
                </p>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM ROW - 3 cards spanning all 3 columns */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
            {bottomLeft && (
              <div>
                <NewsCard
                  article={bottomLeft}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              </div>
            )}
            
            {bottomMid && (
              <div>
                <NewsCard
                  article={bottomMid}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              </div>
            )}
            
            {bottomRight && (
              <div>
                <NewsCard
                  article={bottomRight}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile extra cards to reach 6 total */}
      <div className="mt-4 space-y-4 lg:hidden">
        {rightTop && (
          <NewsCard
            article={rightTop}
            variant="compact"
            orientation="horizontal"
            hideMetaMobile={true}
            showCategory={true}
          />
        )}
        {mobile5 && (
          <NewsCard
            article={mobile5}
            variant="compact"
            orientation="horizontal"
            hideMetaMobile={true}
            showCategory={true}
          />
        )}
      </div>

      {/* Explore More */}
      <div className="flex justify-center mt-8">
        <a
          href={exploreHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Explore More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default BigContainer;