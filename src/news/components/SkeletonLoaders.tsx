import React from 'react';

/**
 * SKELETON LOADING COMPONENTS
 * Industry-standard solution for eliminating blank white screens during content loading
 * Used by: Facebook, LinkedIn, YouTube, Medium, etc.
 * 
 * Benefits:
 * - Perceived performance improvement (feels 30-40% faster)
 * - No jarring white flashes during navigation
 * - User knows content is loading (better UX than blank screen)
 * - Smooth transition when real content appears
 */

// ============================================
// BASE SKELETON PRIMITIVES
// ============================================

const SkeletonBase: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded ${className}`}></div>
);

const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => (
      <SkeletonBase 
        key={idx} 
        className={`h-4 ${idx === lines - 1 ? 'w-3/4' : 'w-full'}`} 
      />
    ))}
  </div>
);

const SkeletonImage: React.FC<{ aspectRatio?: string; className?: string }> = ({ 
  aspectRatio = 'aspect-video', 
  className = '' 
}) => (
  <div className={`${aspectRatio} ${className} relative overflow-hidden bg-gray-200 rounded-xl`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmerSlow"></div>
  </div>
);

// ============================================
// NEWS CARD SKELETON VARIANTS
// ============================================

export const NewsCardSkeleton: React.FC<{ variant?: 'hero' | 'large' | 'medium' | 'standard' | 'compact' | 'mini' }> = ({ 
  variant = 'standard' 
}) => {
  const skeletonVariants = {
    hero: (
      <div className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl h-[600px] lg:h-[700px]">
        <SkeletonImage className="h-full w-full" aspectRatio="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 space-y-4">
            <SkeletonBase className="h-6 w-32 rounded-full" />
            <SkeletonBase className="h-12 w-4/5" />
            <SkeletonBase className="h-12 w-3/4" />
            <SkeletonBase className="h-6 w-2/3 mt-6" />
          </div>
        </div>
      </div>
    ),
    
    large: (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <SkeletonImage className="w-full" />
        <div className="p-6 space-y-4">
          <SkeletonBase className="h-5 w-24 rounded-full" />
          <SkeletonBase className="h-8 w-full" />
          <SkeletonBase className="h-8 w-4/5" />
          <SkeletonText lines={3} className="mt-4" />
          <div className="flex items-center gap-4 mt-6">
            <SkeletonBase className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBase className="h-4 w-32" />
              <SkeletonBase className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    ),

    medium: (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <SkeletonImage />
        <div className="p-5 space-y-3">
          <SkeletonBase className="h-4 w-20 rounded-full" />
          <SkeletonBase className="h-7 w-full" />
          <SkeletonBase className="h-7 w-3/4" />
          <SkeletonText lines={2} className="mt-3" />
        </div>
      </div>
    ),

    standard: (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <SkeletonImage />
        <div className="p-4 space-y-3">
          <SkeletonBase className="h-4 w-16 rounded-full" />
          <SkeletonBase className="h-6 w-full" />
          <SkeletonBase className="h-6 w-4/5" />
          <SkeletonText lines={2} className="mt-3" />
        </div>
      </div>
    ),

    compact: (
      <div className="flex gap-4 bg-white rounded-lg shadow-md p-4">
        <SkeletonImage className="w-32 h-32 flex-shrink-0" aspectRatio="aspect-square" />
        <div className="flex-1 space-y-3">
          <SkeletonBase className="h-4 w-16 rounded-full" />
          <SkeletonBase className="h-5 w-full" />
          <SkeletonBase className="h-5 w-4/5" />
          <SkeletonBase className="h-4 w-24 mt-4" />
        </div>
      </div>
    ),

    mini: (
      <div className="flex gap-3 bg-white rounded-md shadow p-3">
        <SkeletonImage className="w-20 h-20 flex-shrink-0" aspectRatio="aspect-square" />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-3/4" />
          <SkeletonBase className="h-3 w-20 mt-2" />
        </div>
      </div>
    ),
  };

  return skeletonVariants[variant] || skeletonVariants.standard;
};

// ============================================
// CATEGORY SECTION SKELETON
// ============================================

export const CategorySectionSkeleton: React.FC<{ layout?: string }> = ({ layout = 'grid' }) => {
  const layoutSkeletons = {
    // Hero section (always at top)
    hero: (
      <div className="container mx-auto px-4 py-12">
        <SkeletonBase className="h-10 w-64 mb-8" />
        <NewsCardSkeleton variant="hero" />
      </div>
    ),

    // Standard grid layout
    grid: (
      <div className="container mx-auto px-4 py-12">
        <SkeletonBase className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <NewsCardSkeleton key={idx} variant="standard" />
          ))}
        </div>
      </div>
    ),

    // Magazine style with sidebar
    magazine: (
      <div className="container mx-auto px-4 py-12">
        <SkeletonBase className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <NewsCardSkeleton variant="large" />
            <NewsCardSkeleton variant="large" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <NewsCardSkeleton key={idx} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    ),

    // Masonry style
    masonry: (
      <div className="container mx-auto px-4 py-12">
        <SkeletonBase className="h-8 w-48 mb-6" />
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="break-inside-avoid">
              <NewsCardSkeleton variant={idx % 2 === 0 ? 'medium' : 'standard'} />
            </div>
          ))}
        </div>
      </div>
    ),

    // List view
    list: (
      <div className="container mx-auto px-4 py-12">
        <SkeletonBase className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <NewsCardSkeleton key={idx} variant="compact" />
          ))}
        </div>
      </div>
    ),
  };

  return layoutSkeletons[layout as keyof typeof layoutSkeletons] || layoutSkeletons.grid;
};

// ============================================
// FULL PAGE SKELETON LOADER
// ============================================

export const LandingPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <CategorySectionSkeleton layout="hero" />

      {/* Multiple Category Sections with varied layouts */}
      <CategorySectionSkeleton layout="grid" />
      <CategorySectionSkeleton layout="magazine" />
      <CategorySectionSkeleton layout="masonry" />
      <CategorySectionSkeleton layout="list" />
      <CategorySectionSkeleton layout="grid" />
    </div>
  );
};

// ============================================
// INFINITE SCROLL SKELETON
// ============================================

export const InfiniteScrollSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <NewsCardSkeleton key={idx} variant="standard" />
        ))}
      </div>
    </div>
  );
};

// ============================================
// SMART LOADING WRAPPER
// ============================================

interface SmartLoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeletonType?: 'page' | 'section' | 'cards';
  skeletonLayout?: string;
  cardCount?: number;
}

export const SmartLoadingWrapper: React.FC<SmartLoadingWrapperProps> = ({
  isLoading,
  children,
  skeletonType = 'section',
  skeletonLayout = 'grid',
  cardCount = 6,
}) => {
  if (!isLoading) return <>{children}</>;

  switch (skeletonType) {
    case 'page':
      return <LandingPageSkeleton />;
    case 'section':
      return <CategorySectionSkeleton layout={skeletonLayout} />;
    case 'cards':
      return <InfiniteScrollSkeleton count={cardCount} />;
    default:
      return <CategorySectionSkeleton layout={skeletonLayout} />;
  }
};

// ============================================
// CSS ANIMATIONS (Add to your global CSS or tailwind.config.js)
// ============================================

const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes shimmerSlow {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }

  .animate-shimmerSlow {
    animation: shimmerSlow 3s ease-in-out infinite;
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}

export default NewsCardSkeleton;