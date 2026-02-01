// components/AdBanner.tsx
import React, { useEffect, useMemo, useState } from "react";
import { type Ad } from "../../types";
import { trackAdImpression, trackAdClick } from "../../utils/randomAdSelector";

export interface AdBannerProps {
  ad: Ad;
  placement:
    | "banner"
    | "sidebar"
    | "inline"
    | "bottom"
    | "category"
    | "landing"
    | "search";
  className?: string;
  size?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ ad, placement, className = "", size }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    trackAdImpression(ad.id, placement);
  }, [ad.id, placement]);

  const handleAdClick = () => {
    trackAdClick(ad.id, placement);
    window.open(ad.clickUrl, "_blank", "noopener,noreferrer");
  };

  const layoutClass = useMemo(() => {
    const key = size ?? ad.type;

    switch (key) {
      case "leaderboard":
        return "min-h-[90px] md:min-h-[120px]";
      case "banner":
        return "min-h-[80px] md:min-h-[100px]";
      case "medium-rectangle":
      case "sidebar":
        return "min-h-[220px] md:min-h-[250px]";
      case "inline":
        return "min-h-[80px] md:min-h-[100px]";
      case "bottom":
        return "min-h-[72px]";
      default:
        return "min-h-[90px] md:min-h-[120px]";
    }
  }, [ad.type, size]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="px-3 py-1 bg-gray-100 border-b border-gray-200">
        <span className="text-xs text-gray-500 font-medium">Sponsored</span>
      </div>

      <div
        className={`cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${layoutClass}`}
        onClick={handleAdClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleAdClick();
          }
        }}
        aria-label={`Advertisement: ${ad.title}`}
      >
        <div className="flex h-full">
          {/* Image container with skeleton */}
          <div className="flex-shrink-0 w-28 sm:w-32 md:w-40 h-full">
            <div className={`relative w-full h-full ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                decoding="async"
                onLoad={handleImageLoad}
              />
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-1">
              {ad.title}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-2">
              {ad.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[11px] md:text-xs text-gray-500">by {ad.company}</span>
              <span className="text-[11px] md:text-xs text-primary-600 font-semibold hover:text-primary-700">
                Learn More →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;