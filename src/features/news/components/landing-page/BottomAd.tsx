import React from 'react';
import type { Ad } from '../../../../news/types';
import AdBanner from '../../../../news/components/AdBanner';
interface BottomAdProps {
  ad: Ad | null;
}

const BottomAd: React.FC<BottomAdProps> = ({ ad }) => {
  if (!ad) return null;

  return (
    <section className="w-full my-10 md:my-12">
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg p-2 border-2 border-gray-200">
        <AdBanner
          ad={ad}
          placement="landing"
          size="leaderboard"
          className="min-h-[90px] md:min-h-[120px]"
        />
      </div>
    </section>
  );
};

export default BottomAd;