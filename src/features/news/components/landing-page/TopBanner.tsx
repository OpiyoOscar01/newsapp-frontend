import React from 'react';
import type { Ad } from '../../../../news/types';
import AdBanner from '../../../../news/components/AdBanner';

interface TopBannerProps {
  ad: Ad | null;
}

const TopBanner: React.FC<TopBannerProps> = ({ ad }) => {
  if (!ad) return null;

  return (
    <section className="mb-8 md:mb-12">
      <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-1 border-2 border-gray-200">
        <AdBanner
          ad={ad}
          placement="banner"
          size="leaderboard"
          className="min-h-[90px] md:min-h-[120px]"
        />
      </div>
    </section>
  );
};

export default TopBanner;