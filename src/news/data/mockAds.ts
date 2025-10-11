import {type Ad } from '../types';

export const mockAds: Ad[] = [
  {
    id: 'ad-1',
    title: 'Boost Your Business with Cloud Solutions',
    description: 'Transform your workflow with enterprise-grade cloud services. Scale effortlessly and save costs.',
    imageUrl: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
    clickUrl: 'https://example.com/cloud-solutions',
    type: 'banner',
    placement: ['landing', 'category', 'article'],
    company: 'CloudTech Solutions',
    isActive: true
  },
  {
    id: 'ad-2',
    title: 'Professional Development Courses',
    description: 'Advance your career with expert-led online courses. Get certified in high-demand skills.',
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg',
    clickUrl: 'https://example.com/learning-platform',
    type: 'sidebar',
    placement: ['category', 'article'],
    company: 'SkillUp Academy',
    isActive: true
  },
  {
    id: 'ad-3',
    title: 'Smart Home Security System',
    description: 'Protect your family with AI-powered security. 24/7 monitoring and instant alerts.',
    imageUrl: 'https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg',
    clickUrl: 'https://example.com/smart-security',
    type: 'inline',
    placement: ['article'],
    company: 'SecureHome Tech',
    isActive: true
  },
  {
    id: 'ad-4',
    title: 'Premium Financial Advisory',
    description: 'Maximize your investments with personalized financial strategies from certified advisors.',
    imageUrl: 'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg',
    clickUrl: 'https://example.com/financial-advisory',
    type: 'banner',
    placement: ['business', 'landing'],
    company: 'WealthWise Partners',
    isActive: true
  },
  {
    id: 'ad-5',
    title: 'Sustainable Fashion Collection',
    description: 'Discover eco-friendly fashion that looks good and feels great. Made from recycled materials.',
    imageUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    clickUrl: 'https://example.com/eco-fashion',
    type: 'sidebar',
    placement: ['landing', 'category'],
    company: 'GreenStyle Co.',
    isActive: true
  },
  {
    id: 'ad-6',
    title: 'AI-Powered Project Management',
    description: 'Streamline your projects with intelligent automation. Increase productivity by 40%.',
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    clickUrl: 'https://example.com/project-management',
    type: 'inline',
    placement: ['technology', 'business'],
    company: 'ProFlow Systems',
    isActive: true
  },
  {
    id: 'ad-7',
    title: 'Fitness Tracker Revolution',
    description: 'Monitor your health 24/7 with advanced biometric tracking. Achieve your fitness goals.',
    imageUrl: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg',
    clickUrl: 'https://example.com/fitness-tracker',
    type: 'bottom',
    placement: ['health', 'sports'],
    company: 'FitTech Innovations',
    isActive: true
  },
  {
    id: 'ad-8',
    title: 'Global Travel Insurance',
    description: 'Travel with confidence. Comprehensive coverage for medical emergencies and trip cancellations.',
    imageUrl: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg',
    clickUrl: 'https://example.com/travel-insurance',
    type: 'banner',
    placement: ['world', 'landing'],
    company: 'SafeJourney Insurance',
    isActive: true
  },
  {
    id: 'ad-9',
    title: 'Electric Vehicle Charging',
    description: 'Install home EV charging stations. Fast, reliable, and energy-efficient solutions.',
    imageUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg',
    clickUrl: 'https://example.com/ev-charging',
    type: 'sidebar',
    placement: ['technology', 'science'],
    company: 'ElectroCharge Solutions',
    isActive: true
  },
  {
    id: 'ad-10',
    title: 'Premium Coffee Subscription',
    description: 'Freshly roasted coffee delivered monthly. Discover unique flavors from around the world.',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    clickUrl: 'https://example.com/coffee-subscription',
    type: 'inline',
    placement: ['landing', 'category'],
    company: 'BrewMaster Coffee',
    isActive: true
  },
  {
    id: 'ad-11',
    title: 'Cybersecurity Training',
    description: 'Protect your organization from cyber threats. Comprehensive security awareness training.',
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
    clickUrl: 'https://example.com/cybersecurity-training',
    type: 'banner',
    placement: ['technology', 'business'],
    company: 'CyberShield Academy',
    isActive: true
  },
  {
    id: 'ad-12',
    title: 'Language Learning App',
    description: 'Master a new language in just 15 minutes a day. Interactive lessons and native speakers.',
    imageUrl: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
    clickUrl: 'https://example.com/language-learning',
    type: 'bottom',
    placement: ['world', 'category'],
    company: 'LinguaFast',
    isActive: true
  }
];

export const getAdsByPlacement = (placement: string): Ad[] => {
  return mockAds.filter(ad => ad.isActive && ad.placement.includes(placement));
};

export const getAdsByType = (type: Ad['type']): Ad[] => {
  return mockAds.filter(ad => ad.isActive && ad.type === type);
};

export const getRandomAd = (placement: string, type?: Ad['type']): Ad | null => {
  let filteredAds = getAdsByPlacement(placement);
  
  if (type) {
    filteredAds = filteredAds.filter(ad => ad.type === type);
  }
  
  if (filteredAds.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * filteredAds.length);
  return filteredAds[randomIndex];
};