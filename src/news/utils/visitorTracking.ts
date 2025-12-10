
export interface VisitorData {
  id: string;
  sessionId: string;
  timestamp: string;
  page: string;
  pageType: 'landing' | 'category' | 'article' | 'other';
  referrer: string;
  referrerType: 'direct' | 'search' | 'social' | 'external' | 'internal';
  userAgent: string;
  screenResolution: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location?: {
    country?: string;
    city?: string;
    timezone: string;
  };
  categorySlug?: string;
  articleId?: string;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: {
    landing: number;
    category: number;
    article: number;
    other: number;
  };
  referrerStats: {
    direct: number;
    search: number;
    social: number;
    external: number;
    internal: number;
  };
  deviceStats: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  topPages: Array<{ page: string; views: number }>;
  topCategories: Array<{ category: string; views: number }>;
  topArticles: Array<{ articleId: string; views: number }>;
  visitsByHour: Record<number, number>;
  visitsByDay: Record<string, number>;
}

const STORAGE_KEY = 'visitor_tracking_data';
const SESSION_KEY = 'visitor_session_id';
const UNIQUE_VISITOR_KEY = 'visitor_unique_id';

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Get or create unique visitor ID
function getUniqueVisitorId(): string {
  let visitorId = localStorage.getItem(UNIQUE_VISITOR_KEY);
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem(UNIQUE_VISITOR_KEY, visitorId);
  }
  return visitorId;
}

// Detect device type
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Classify referrer
function classifyReferrer(referrer: string): 'direct' | 'search' | 'social' | 'external' | 'internal' {
  if (!referrer) return 'direct';
  
  const currentHost = window.location.hostname;
  const referrerUrl = new URL(referrer);
  
  if (referrerUrl.hostname === currentHost) return 'internal';
  
  const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu'];
  if (searchEngines.some(engine => referrerUrl.hostname.includes(engine))) {
    return 'search';
  }
  
  const socialPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'reddit', 'pinterest'];
  if (socialPlatforms.some(platform => referrerUrl.hostname.includes(platform))) {
    return 'social';
  }
  
  return 'external';
}

// Determine page type
function getPageType(pathname: string): 'landing' | 'category' | 'article' | 'other' {
  if (pathname === '/' || pathname === '/home') return 'landing';
  if (pathname.startsWith('/category/')) return 'category';
  if (pathname.startsWith('/article/')) return 'article';
  return 'other';
}

// Track visitor
export function trackVisitor(options?: {
  categorySlug?: string;
  articleId?: string;
}): void {
  try {
    const pathname = window.location.pathname;
    const pageType = getPageType(pathname);
    
    const visitorData: VisitorData = {
      id: generateId(),
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      page: pathname,
      pageType,
      referrer: document.referrer,
      referrerType: classifyReferrer(document.referrer),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      deviceType: getDeviceType(),
      location: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      categorySlug: options?.categorySlug,
      articleId: options?.articleId,
    };
    
    // Store in localStorage
    const existingData = getAllVisitorData();
    existingData.push(visitorData);
    
    // Keep only last 1000 visits to prevent storage overflow
    const limitedData = existingData.slice(-1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedData));
    
    console.log('Visitor tracked:', visitorData);
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

// Get all visitor data
export function getAllVisitorData(): VisitorData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving visitor data:', error);
    return [];
  }
}

// Get visitor statistics
export function getVisitorStats(days: number = 7): VisitorStats {
  const allData = getAllVisitorData();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // Filter data by date range
  const recentData = allData.filter(v => new Date(v.timestamp) >= cutoffDate);
  
  // Calculate unique visitors
  const uniqueSessions = new Set(recentData.map(v => v.sessionId));
  const uniqueVisitors = localStorage.getItem(UNIQUE_VISITOR_KEY) ? 1 : 0;
  
  // Page views by type
  const pageViews = {
    landing: recentData.filter(v => v.pageType === 'landing').length,
    category: recentData.filter(v => v.pageType === 'category').length,
    article: recentData.filter(v => v.pageType === 'article').length,
    other: recentData.filter(v => v.pageType === 'other').length,
  };
  
  // Referrer stats
  const referrerStats = {
    direct: recentData.filter(v => v.referrerType === 'direct').length,
    search: recentData.filter(v => v.referrerType === 'search').length,
    social: recentData.filter(v => v.referrerType === 'social').length,
    external: recentData.filter(v => v.referrerType === 'external').length,
    internal: recentData.filter(v => v.referrerType === 'internal').length,
  };
  
  // Device stats
  const deviceStats = {
    mobile: recentData.filter(v => v.deviceType === 'mobile').length,
    tablet: recentData.filter(v => v.deviceType === 'tablet').length,
    desktop: recentData.filter(v => v.deviceType === 'desktop').length,
  };
  
  // Top pages
  const pageCount = recentData.reduce((acc, v) => {
    acc[v.page] = (acc[v.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topPages = Object.entries(pageCount)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Top categories
  const categoryCount = recentData
    .filter(v => v.categorySlug)
    .reduce((acc, v) => {
      const cat = v.categorySlug!;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categoryCount)
    .map(([category, views]) => ({ category, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Top articles
  const articleCount = recentData
    .filter(v => v.articleId)
    .reduce((acc, v) => {
      const art = v.articleId!;
      acc[art] = (acc[art] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const topArticles = Object.entries(articleCount)
    .map(([articleId, views]) => ({ articleId, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Visits by hour
  const visitsByHour = recentData.reduce((acc, v) => {
    const hour = new Date(v.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Visits by day
  const visitsByDay = recentData.reduce((acc, v) => {
    const day = new Date(v.timestamp).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalVisits: recentData.length,
    uniqueVisitors: uniqueSessions.size,
    pageViews,
    referrerStats,
    deviceStats,
    topPages,
    topCategories,
    topArticles,
    visitsByHour,
    visitsByDay,
  };
}

// Export data for backend
export function exportVisitorDataForBackend(): {
  data: VisitorData[];
  stats: VisitorStats;
  exportedAt: string;
} {
  return {
    data: getAllVisitorData(),
    stats: getVisitorStats(30), // Last 30 days
    exportedAt: new Date().toISOString(),
  };
}

// Clear old data (optional cleanup)
export function clearOldVisitorData(days: number = 30): void {
  const allData = getAllVisitorData();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentData = allData.filter(v => new Date(v.timestamp) >= cutoffDate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentData));
}
