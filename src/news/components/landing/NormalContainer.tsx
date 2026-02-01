import React, { useEffect, useRef, useState } from "react";
import { type Article } from "../../types";
import NewsCard from "../NewsCard";

/**
 * Progressive disclosure:
 * - We render the headline/top story immediately.
 * - We delay the grid mount until the section is near viewport.
 * This reduces initial cost, especially images + ad slots elsewhere.
 */
const useNearViewport = (rootMargin = "600px") => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const obs = new IntersectionObserver(
      (entries) => {
        const any = entries.some((e) => e.isIntersecting);
        if (any) {
          setIsNear(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, isNear };
};

type NormalContainerProps = {
  articles: Article[];
  exploreHref: string;
};

const NormalContainer: React.FC<NormalContainerProps> = ({ articles, exploreHref }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No articles available for this category.
      </div>
    );
  }

  // Desktop uses 5 (1 wide + 4 grid). Mobile must show 6.
  const top = articles[0];
  const a1 = articles[1];
  const a2 = articles[2];
  const a3 = articles[3];
  const a4 = articles[4];
  const a5 = articles[5];

  const { ref, isNear } = useNearViewport("700px");

  return (
    <div className="w-full" ref={ref}>
      <div className="space-y-4 lg:space-y-6">
        {/* TOP WIDE - render immediately */}
        <div>
          <NewsCard
            article={top}
            variant="wide"
            priority="normal"
            isFirstInCategory={true}
            showCategory={true}
          />
        </div>

        {/* Bottom grid mounts only when near viewport */}
        {isNear && (
          <>
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
              {a1 && (
                <NewsCard
                  article={a1}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
              {a2 && (
                <NewsCard
                  article={a2}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
              {a3 && (
                <NewsCard
                  article={a3}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
              {a4 && (
                <NewsCard
                  article={a4}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              )}
            </div>

            {/* Mobile 6th card */}
            {a5 && (
              <div className="lg:hidden">
                <NewsCard
                  article={a5}
                  variant="compact"
                  orientation="horizontal"
                  hideMetaMobile={true}
                  showCategory={true}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Explore More in blue */}
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

export default NormalContainer;
