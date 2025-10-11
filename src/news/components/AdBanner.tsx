import React, { useEffect } from 'react';
import {type Ad } from '../types';
import { trackAdImpression, trackAdClick } from '../utils/randomAdSelector';

interface AdBannerProps {
  ad: Ad;
  placement: string;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ ad, placement, className = '' }) => {
  useEffect(() => {
    // Track ad impression when component mounts
    trackAdImpression(ad.id, placement);
  }, [ad.id, placement]);

  const handleAdClick = () => {
    trackAdClick(ad.id, placement);
    window.open(ad.clickUrl, '_blank', 'noopener,noreferrer');
  };

  const getAdStyles = () => {
    switch (ad.type) {
      case 'banner':
        return 'w-full h-32 md:h-40';
      case 'sidebar':
        return 'w-full h-64';
      case 'inline':
        return 'w-full h-24 md:h-32';
      case 'bottom':
        return 'w-full h-20';
      default:
        return 'w-full h-32';
    }
  };

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Sponsored label */}
      <div className="px-3 py-1 bg-gray-100 border-b border-gray-200">
        <span className="text-xs text-gray-500 font-medium">Sponsored</span>
      </div>
      
      {/* Ad content */}
      <div 
        className={`cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${getAdStyles()}`}
        onClick={handleAdClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAdClick();
          }
        }}
        aria-label={`Advertisement: ${ad.title}`}
      >
        <div className="flex h-full">
          {/* Ad image */}
          <div className="flex-shrink-0 w-24 md:w-32 h-full">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Ad text content */}
          <div className="flex-1 p-3 flex flex-col justify-center">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-1">
              {ad.title}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-2">
              {ad.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                by {ad.company}
              </span>
              <span className="text-xs text-primary-600 font-medium hover:text-primary-700">
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