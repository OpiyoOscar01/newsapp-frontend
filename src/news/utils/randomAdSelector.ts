import {type Ad } from '../types';
import { mockAds } from '../data/mockAds';

export const selectRandomAd = (
  placement: string,
  type?: Ad['type'],
  excludeIds: string[] = []
): Ad | null => {
  let filteredAds = mockAds.filter(ad => 
    ad.isActive && 
    ad.placement.includes(placement) &&
    !excludeIds.includes(ad.id)
  );

  if (type) {
    filteredAds = filteredAds.filter(ad => ad.type === type);
  }

  if (filteredAds.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filteredAds.length);
  return filteredAds[randomIndex];
};

export const selectMultipleAds = (
  placement: string,
  count: number,
  type?: Ad['type']
): Ad[] => {
  const selectedAds: Ad[] = [];
  const excludeIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const ad = selectRandomAd(placement, type, excludeIds);
    if (ad) {
      selectedAds.push(ad);
      excludeIds.push(ad.id);
    }
  }

  return selectedAds;
};

export const rotateAds = (
  ads: Ad[],
  rotationInterval: number = 30000
): Ad => {
  if (ads.length === 0) throw new Error('No ads provided for rotation');
  
  const now = Date.now();
  const rotationIndex = Math.floor(now / rotationInterval) % ads.length;
  return ads[rotationIndex];
};

export const getContextualAd = (
  category: string,
  keywords: string[] = [],
  type?: Ad['type']
): Ad | null => {
  // First try to find ads specifically for this category
  let contextualAd = selectRandomAd(category, type);
  
  if (contextualAd) return contextualAd;

  // If no category-specific ad, try finding ads that match keywords
  const keywordMatchedAds = mockAds.filter(ad => {
    const adText = `${ad.title} ${ad.description}`.toLowerCase();
    return keywords.some(keyword => 
      adText.includes(keyword.toLowerCase())
    );
  });

  if (keywordMatchedAds.length > 0) {
    const randomIndex = Math.floor(Math.random() * keywordMatchedAds.length);
    return keywordMatchedAds[randomIndex];
  }

  // Fallback to any available ad for the placement
  return selectRandomAd('landing', type);
};

export const trackAdImpression = (adId: string, placement: string): void => {
  // In a real application, this would send data to an analytics service
  console.log(`Ad impression tracked: ${adId} on ${placement}`);
};

export const trackAdClick = (adId: string, placement: string): void => {
  // In a real application, this would send data to an analytics service
  console.log(`Ad click tracked: ${adId} on ${placement}`);
};