import { analyticsService, type TrackVisitorPayload } from '../services/news/analyticsService';

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
const PENDING_SYNC_KEY = 'visitor_pending_sync';
const LAST_SYNC_KEY = 'visitor_last_sync';
const STATS_CACHE_KEY = 'visitor_stats_cache';
const STATS_CACHE_EXPIRY_KEY = 'visitor_stats_cache_expiry';

// Configuration
const SYNC_INTERVAL = 5 * 60 * 1000; // Sync every 5 minutes
const STATS_CACHE_DURATION = 5 * 60 * 1000; // Cache stats for 5 minutes
const MAX_LOCAL_STORAGE_SIZE = 1000; // Maximum visits to keep in local storage
const MAX_PENDING_SYNC_SIZE = 500; // Maximum pending items

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
  
  try {
    const currentHost = window.location.hostname;
    const referrerUrl = new URL(referrer);
    
    if (referrerUrl.hostname === currentHost) return 'internal';
    
    const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu'];
    if (searchEngines.some(engine => referrerUrl.hostname.includes(engine))) {
      return 'search';
    }
    
    const socialPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'reddit', 'pinterest', 'tiktok', 'youtube'];
    if (socialPlatforms.some(platform => referrerUrl.hostname.includes(platform))) {
      return 'social';
    }
    
    return 'external';
  } catch {
    return 'direct';
  }
}

// Determine page type
function getPageType(pathname: string): 'landing' | 'category' | 'article' | 'other' {
  if (pathname === '/' || pathname === '/home') return 'landing';
  if (pathname.startsWith('/category/')) return 'category';
  if (pathname.startsWith('/article/')) return 'article';
  return 'other';
}

// Get pending sync data
function getPendingSyncData(): TrackVisitorPayload[] {
  try {
    const data = localStorage.getItem(PENDING_SYNC_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving pending sync data:', error);
    return [];
  }
}

// Add to pending sync
function addToPendingSync(payload: TrackVisitorPayload): void {
  try {
    const pending = getPendingSyncData();
    pending.push(payload);
    // Keep only last MAX_PENDING_SYNC_SIZE pending items
    const limited = pending.slice(-MAX_PENDING_SYNC_SIZE);
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error adding to pending sync:', error);
  }
}

// Clear pending sync
function clearPendingSync(): void {
  try {
    localStorage.removeItem(PENDING_SYNC_KEY);
  } catch (error) {
    console.error('Error clearing pending sync:', error);
  }
}

// Store in local storage as backup
function storeLocally(visitorData: VisitorData): void {
  try {
    const existingData = getAllVisitorData();
    existingData.push(visitorData);
    
    // Keep only last MAX_LOCAL_STORAGE_SIZE visits
    const limitedData = existingData.slice(-MAX_LOCAL_STORAGE_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedData));
  } catch (error) {
    console.error('Error storing data locally:', error);
  }
}

// Sync pending data to backend
async function syncPendingData(): Promise<void> {
  const pending = getPendingSyncData();
  if (pending.length === 0) return;

  try {
    console.log(`Syncing ${pending.length} pending visitor events to backend...`);
    const result = await analyticsService.batchTrackVisitors();
    
    if (result.success > 0) {
      console.log(`Successfully synced ${result.success}/${pending.length} events`);
      
      // Only clear successfully synced items
      if (result.failed === 0) {
        clearPendingSync();
      } else {
        // Keep failed items for retry
        const failedItems = pending.filter((_, index) => 
          result.errors.some(error => error.index === index)
        );
        localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(failedItems));
        console.warn(`${result.failed} events failed to sync, will retry later`);
      }
      
      localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    }
  } catch (error) {
    console.error('Error syncing pending data:', error);
    // Don't clear pending data on error - will retry later
  }
}

// Initialize automatic sync
let syncInterval: number | null = null;

function initializeAutoSync(): void {
  // Clear existing interval
  if (syncInterval !== null) {
    clearInterval(syncInterval);
  }

  // Sync immediately if there's pending data
  const pending = getPendingSyncData();
  if (pending.length > 0) {
    syncPendingData().catch(console.error);
  }

  // Set up periodic sync
  syncInterval = window.setInterval(() => {
    syncPendingData().catch(console.error);
  }, SYNC_INTERVAL);

  // Sync on page unload (best effort)
  window.addEventListener('beforeunload', () => {
    const pending = getPendingSyncData();
    if (pending.length > 0 && navigator.sendBeacon) {
      // Use sendBeacon for reliable delivery on page unload
      try {
        const data = JSON.stringify(pending[pending.length - 1]);
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon('/api/v1/analytics/visitors/track', blob);
      } catch (error) {
        console.error('Failed to send beacon:', error);
      }
    }
  });

  // Sync when page becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const pending = getPendingSyncData();
      if (pending.length > 0) {
        syncPendingData().catch(console.error);
      }
    }
  });
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeAutoSync();
}

/**
 * Track visitor with backend integration and local storage fallback
 */
export async function trackVisitor(options?: {
  categorySlug?: string;
  articleId?: string;
}): Promise<void> {
  try {
    const pathname = window.location.pathname;
    const pageType = getPageType(pathname);
    const sessionId = getSessionId();
    const uniqueVisitorId = getUniqueVisitorId();
    
    const payload: TrackVisitorPayload = {
      sessionId,
      uniqueVisitorId,
      page: pathname,
      pageType,
      referrer: document.referrer || undefined,
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
    
    // Create local backup immediately
    const localData: VisitorData = {
      id: generateId(),
      sessionId,
      timestamp: new Date().toISOString(),
      page: pathname,
      pageType,
      referrer: document.referrer,
      referrerType: payload.referrerType,
      userAgent: navigator.userAgent,
      screenResolution: payload.screenResolution || '',
      deviceType: payload.deviceType,
      location: payload.location,
      categorySlug: options?.categorySlug,
      articleId: options?.articleId,
    };
    
    storeLocally(localData);
    
    // Try to send to backend immediately
    try {
      await analyticsService.trackVisitor();
      console.log('Visitor tracked successfully');
    } catch (error) {
      // If backend fails, add to pending sync queue
      console.warn('Backend tracking failed, adding to pending sync:', error);
      addToPendingSync(payload);
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

/**
 * Get all visitor data from local storage
 */
export function getAllVisitorData(): VisitorData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving visitor data:', error);
    return [];
  }
}

/**
 * Get visitor statistics with backend integration and local fallback
 */
export async function getVisitorStats(days: number = 7): Promise<VisitorStats> {
  // Check cache first
  const cacheKey = `${STATS_CACHE_KEY}_${days}`;
  const cacheExpiryKey = `${STATS_CACHE_EXPIRY_KEY}_${days}`;
  
  try {
    const cachedStats = localStorage.getItem(cacheKey);
    const cacheExpiry = localStorage.getItem(cacheExpiryKey);
    
    if (cachedStats && cacheExpiry) {
      const expiryTime = parseInt(cacheExpiry);
      if (Date.now() < expiryTime) {
        console.log('Returning cached stats');
        return JSON.parse(cachedStats);
      }
    }
  } catch (error) {
    console.error('Error reading stats cache:', error);
  }

  // Try to get from backend
  try {
    console.log('Fetching stats from backend...');
    const stats = await analyticsService.getVisitorStats();
    
    // Cache the results
    try {
      localStorage.setItem(cacheKey, JSON.stringify(stats));
      localStorage.setItem(cacheExpiryKey, (Date.now() + STATS_CACHE_DURATION).toString());
    } catch (error) {
      console.error('Error caching stats:', error);
    }
    
    return stats;
  } catch (error) {
    console.warn('Failed to get stats from backend, using local calculation:', error);
    return calculateLocalStats(days);
  }
}

/**
 * Calculate statistics from local storage data
 */
function calculateLocalStats(days: number): VisitorStats {
  const allData = getAllVisitorData();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // Filter data by date range
  const recentData = allData.filter(v => new Date(v.timestamp) >= cutoffDate);
  
  // Calculate unique visitors (by sessionId)
  const uniqueSessions = new Set(recentData.map(v => v.sessionId));
  
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

/**
 * Get real-time visitor count from backend
 */
export async function getRealtimeVisitors() {
  try {
    return await analyticsService.getRealtimeVisitors();
  } catch (error) {
    console.error('Failed to get realtime visitors:', error);
    // Fallback to local calculation
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const allData = getAllVisitorData();
    const todayData = allData.filter(v => new Date(v.timestamp) >= todayStart);
    const uniqueSessions = new Set(todayData.map(v => v.sessionId));
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeData = allData.filter(v => new Date(v.timestamp) >= fiveMinutesAgo);
    const activeSessions = new Set(activeData.map(v => v.sessionId));
    
    return {
      total_today: todayData.length,
      unique_today: uniqueSessions.size,
      active_now: activeSessions.size,
    };
  }
}

/**
 * Export data for backend synchronization
 */
export async function exportVisitorDataForBackend(days: number = 30): Promise<{
  data: VisitorData[];
  stats: VisitorStats;
  exportedAt: string;
}> {
  try {
    const backendData = await analyticsService.exportVisitorData();
    return {
      data: backendData.raw_data,
      stats: backendData.stats,
      exportedAt: backendData.exported_at,
    };
  } catch (error) {
    console.warn('Failed to export from backend, using local data:', error);
    return {
      data: getAllVisitorData(),
      stats: await getVisitorStats(days),
      exportedAt: new Date().toISOString(),
    };
  }
}

/**
 * Clear old visitor data from local storage
 */
export function clearOldVisitorData(days: number = 30): void {
  const allData = getAllVisitorData();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentData = allData.filter(v => new Date(v.timestamp) >= cutoffDate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentData));
  
  console.log(`Cleared ${allData.length - recentData.length} old visitor records`);
}

/**
 * Force sync pending data to backend
 */
export async function forceSyncToBackend(): Promise<void> {
  await syncPendingData();
}

/**
 * Get sync status
 */
export function getSyncStatus(): {
  pendingCount: number;
  lastSyncTime: Date | null;
} {
  const pending = getPendingSyncData();
  const lastSync = localStorage.getItem(LAST_SYNC_KEY);
  
  return {
    pendingCount: pending.length,
    lastSyncTime: lastSync ? new Date(parseInt(lastSync)) : null,
  };
}

/**
 * Clear all stats cache
 */
export function clearStatsCache(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STATS_CACHE_KEY) || key.startsWith(STATS_CACHE_EXPIRY_KEY)) {
      localStorage.removeItem(key);
    }
  });
  console.log('Stats cache cleared');
}