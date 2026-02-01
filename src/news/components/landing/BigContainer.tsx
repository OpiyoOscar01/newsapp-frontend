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

  /**
   * Requirements:
   * - Desktop: main big card (left), right column has one small card (top-right),
   *   and the AD spans down into the 2nd row occupying the “third-slot” position.
   *   Bottom row (under main): only TWO cards remain (because ad took the 3rd slot).
   * - Mobile: 6 cards stacked.
   */
  const main = articles[0];
  const rightTop = articles[1];

  const bottomLeft = articles[2];
  const bottomMid = articles[3];
  // On desktop, we intentionally do NOT place a bottom-right third card.
  // On mobile, we show 6 total:
  const mobile4 = articles[4];
  const mobile5 = articles[5];

  return (
    <div className="w-full">
      {/* Desktop grid:
          col 1-2: main card
          col 3: right column, where:
            - row 1: small card
            - row 2: ad (spans down; replaces 3rd slot in row 2)
          row 2 under main: two cards only
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 lg:gap-6">
        {/* MAIN (image on top, text below) */}
        <div className="lg:col-span-2 lg:row-span-1">
          <NewsCard
            article={main}
            variant="large"
            priority="high"
            isFirstInCategory={true}
            showCategory={true}
          />
        </div>

        {/* RIGHT TOP CARD */}
        <div className="lg:col-span-1 lg:row-start-1 lg:col-start-3">
          {rightTop && (
            <NewsCard
              article={rightTop}
              variant="compact"
              orientation="horizontal"
              hideMetaMobile={true}
              showCategory={true}
            />
          )}
        </div>

        {/* BOTTOM LEFT (under main) */}
        <div className="lg:col-span-1 lg:row-start-2 lg:col-start-1">
          {bottomLeft && (
            <NewsCard
              article={bottomLeft}
              variant="compact"
              orientation="horizontal"
              hideMetaMobile={true}
              showCategory={true}
            />
          )}
        </div>

        {/* BOTTOM MID (under main) */}
        <div className="lg:col-span-1 lg:row-start-2 lg:col-start-2">
          {bottomMid && (
            <NewsCard
              article={bottomMid}
              variant="compact"
              orientation="horizontal"
              hideMetaMobile={true}
              showCategory={true}
            />
          )}
        </div>

        {/* RIGHT AD (spans into row 2; replaces 3rd slot on row 2) */}
        <div className="lg:col-span-1 lg:row-start-2 lg:col-start-3">
          {sidebarAd && (
            <div className="bg-gray-50 rounded-lg p-2 border-2 border-gray-200 h-full">
              <AdBanner
                ad={sidebarAd}
                placement="sidebar"
                size="medium-rectangle"
                className="h-full min-h-[220px] lg:min-h-[100%]"
              />
              {showAdHelperText && (
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Sponsored content helps support our journalism
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile extra cards to reach 6 total */}
      <div className="mt-4 space-y-4 lg:hidden">
        {mobile4 && (
          <NewsCard
            article={mobile4}
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

      {/* Explore More (blue, replaces any previous pagination area) */}
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
