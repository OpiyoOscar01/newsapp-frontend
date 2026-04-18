/**
 * VisitorAnalyticsTypes.ts
 * ============================================================================
 * VISITOR ANALYTICS TYPE DEFINITIONS
 * ============================================================================
 *
 * This file contains all TypeScript type declarations and normalizers for
 * visitor tracking, analytics statistics, realtime analytics, exports,
 * sync state, and optimistic queue handling.
 *
 * @module visitorAnalyticsTypes
 */

/* -------------------------------------------------------------------------- */
/*                               CORE CONSTANTS                               */
/* -------------------------------------------------------------------------- */

export const VisitorPageTypes = {
  LANDING: 'landing',
  CATEGORY: 'category',
  ARTICLE: 'article',
  OTHER: 'other',
} as const;

export const VisitorReferrerTypes = {
  DIRECT: 'direct',
  SEARCH: 'search',
  SOCIAL: 'social',
  EXTERNAL: 'external',
  INTERNAL: 'internal',
} as const;

export const VisitorDeviceTypes = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const;

export const VisitorAnalyticsTimeRanges = {
  SEVEN_DAYS: 7,
  THIRTY_DAYS: 30,
  NINETY_DAYS: 90,
} as const;

export type VisitorPageType = typeof VisitorPageTypes[keyof typeof VisitorPageTypes];
export type VisitorReferrerType = typeof VisitorReferrerTypes[keyof typeof VisitorReferrerTypes];
export type VisitorDeviceType = typeof VisitorDeviceTypes[keyof typeof VisitorDeviceTypes];
export type VisitorAnalyticsTimeRange =
  typeof VisitorAnalyticsTimeRanges[keyof typeof VisitorAnalyticsTimeRanges];

/* -------------------------------------------------------------------------- */
/*                              REQUEST PAYLOADS                              */
/* -------------------------------------------------------------------------- */

export interface VisitorLocation {
  country?: string;
  city?: string;
  timezone?: string;
}

export interface TrackVisitorRequest {
  sessionId: string;
  uniqueVisitorId?: string | null;
  page: string;
  pageType: VisitorPageType;
  referrer?: string | null;
  referrerType: VisitorReferrerType;
  userAgent?: string;
  screenResolution?: string;
  deviceType: VisitorDeviceType;
  location?: VisitorLocation;
  categorySlug?: string | null;
  articleId?: string | null;
  additionalData?: Record<string, unknown>;
}

export interface TrackVisitorOptions {
  page?: string;
  categorySlug?: string;
  articleId?: string;
  additionalData?: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                               API ENTITIES                                 */
/* -------------------------------------------------------------------------- */

export interface ApiVisitorLog {
  id: number;
  session_id: string;
  unique_visitor_id?: string | null;
  page: string;
  page_type: VisitorPageType;
  referrer?: string | null;
  referrer_type: VisitorReferrerType;
  user_agent?: string | null;
  screen_resolution?: string | null;
  device_type: VisitorDeviceType;
  country?: string | null;
  city?: string | null;
  timezone?: string | null;
  category_slug?: string | null;
  article_id?: string | number | null;
  ip_address?: string | null;
  additional_data?: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string;
}

export interface VisitorLog {
  id: string;
  sessionId: string;
  uniqueVisitorId?: string;
  page: string;
  pageType: VisitorPageType;
  referrer?: string;
  referrerType: VisitorReferrerType;
  userAgent?: string;
  screenResolution?: string;
  deviceType: VisitorDeviceType;
  location?: VisitorLocation;
  categorySlug?: string;
  articleId?: string;
  ipAddress?: string;
  additionalData?: Record<string, unknown>;
  createdAt: Date;
  updatedAt?: Date;
}

export interface VisitorPageViews {
  landing: number;
  category: number;
  article: number;
  other: number;
}

export interface VisitorReferrerStats {
  direct: number;
  search: number;
  social: number;
  external: number;
  internal: number;
}

export interface VisitorDeviceStats {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface TopPage {
  page: string;
  views: number;
}

export interface TopCategory {
  category: string;
  views: number;
}

export interface TopArticle {
  articleId: string;
  views: number;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: VisitorPageViews;
  referrerStats: VisitorReferrerStats;
  deviceStats: VisitorDeviceStats;
  topPages: TopPage[];
  topCategories: TopCategory[];
  topArticles: TopArticle[];
  visitsByHour: Record<number, number>;
  visitsByDay: Record<string, number>;
}

export interface RealtimeVisitors {
  totalToday: number;
  uniqueToday: number;
  activeNow: number;
}

export interface VisitorExportData {
  rawData: ApiVisitorLog[];
  stats: VisitorStats;
  exportedAt: string;
  timeRange: string;
  totalRecords: number;
}

export interface PendingVisitorEvent extends TrackVisitorRequest {
  clientId: string;
  queuedAt: string;
  retries: number;
}

export interface VisitorSyncStatus {
  pendingCount: number;
  lastSyncTime: Date | null;
  isOnline: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              API RESPONSES                                 */
/* -------------------------------------------------------------------------- */

export interface TrackVisitorResponse {
  success: boolean;
  message: string;
  data: ApiVisitorLog;
}

export interface VisitorStatsResponse {
  success: boolean;
  data: VisitorStats;
}

export interface ApiRealtimeVisitors {
  total_today: number;
  unique_today: number;
  active_now: number;
}

export interface RealtimeVisitorsResponse {
  success: boolean;
  data: ApiRealtimeVisitors;
}

export interface VisitorExportResponse {
  success: boolean;
  data: {
    raw_data: ApiVisitorLog[];
    stats: VisitorStats;
    exported_at: string;
    time_range: string;
    total_records: number;
  };
}

export interface VisitorCleanupResponse {
  success: boolean;
  message: string;
  data?: {
    deletedCount?: number;
    deleted_count?: number;
    days?: number;
  };
}

/* -------------------------------------------------------------------------- */
/*                               EMPTY STATES                                 */
/* -------------------------------------------------------------------------- */

export const emptyVisitorStats = (): VisitorStats => ({
  totalVisits: 0,
  uniqueVisitors: 0,
  pageViews: {
    landing: 0,
    category: 0,
    article: 0,
    other: 0,
  },
  referrerStats: {
    direct: 0,
    search: 0,
    social: 0,
    external: 0,
    internal: 0,
  },
  deviceStats: {
    mobile: 0,
    tablet: 0,
    desktop: 0,
  },
  topPages: [],
  topCategories: [],
  topArticles: [],
  visitsByHour: createEmptyHourlyVisits(),
  visitsByDay: {},
});

export const emptyRealtimeVisitors = (): RealtimeVisitors => ({
  totalToday: 0,
  uniqueToday: 0,
  activeNow: 0,
});

export function createEmptyHourlyVisits(): Record<number, number> {
  const hourly: Record<number, number> = {};
  for (let hour = 0; hour < 24; hour += 1) {
    hourly[hour] = 0;
  }
  return hourly;
}

/* -------------------------------------------------------------------------- */
/*                              NORMALIZERS                                   */
/* -------------------------------------------------------------------------- */

export function toVisitorLogModel(apiLog: ApiVisitorLog): VisitorLog {
  return {
    id: apiLog.id.toString(),
    sessionId: apiLog.session_id,
    uniqueVisitorId: apiLog.unique_visitor_id ?? undefined,
    page: apiLog.page,
    pageType: apiLog.page_type,
    referrer: apiLog.referrer ?? undefined,
    referrerType: apiLog.referrer_type,
    userAgent: apiLog.user_agent ?? undefined,
    screenResolution: apiLog.screen_resolution ?? undefined,
    deviceType: apiLog.device_type,
    location: {
      country: apiLog.country ?? undefined,
      city: apiLog.city ?? undefined,
      timezone: apiLog.timezone ?? undefined,
    },
    categorySlug: apiLog.category_slug ?? undefined,
    articleId: apiLog.article_id != null ? String(apiLog.article_id) : undefined,
    ipAddress: apiLog.ip_address ?? undefined,
    additionalData: apiLog.additional_data ?? undefined,
    createdAt: new Date(apiLog.created_at),
    updatedAt: apiLog.updated_at ? new Date(apiLog.updated_at) : undefined,
  };
}

export function normalizeVisitorStats(stats?: Partial<VisitorStats> | null): VisitorStats {
  const empty = emptyVisitorStats();

  return {
    totalVisits: Number(stats?.totalVisits ?? empty.totalVisits),
    uniqueVisitors: Number(stats?.uniqueVisitors ?? empty.uniqueVisitors),
    pageViews: {
      landing: Number(stats?.pageViews?.landing ?? empty.pageViews.landing),
      category: Number(stats?.pageViews?.category ?? empty.pageViews.category),
      article: Number(stats?.pageViews?.article ?? empty.pageViews.article),
      other: Number(stats?.pageViews?.other ?? empty.pageViews.other),
    },
    referrerStats: {
      direct: Number(stats?.referrerStats?.direct ?? empty.referrerStats.direct),
      search: Number(stats?.referrerStats?.search ?? empty.referrerStats.search),
      social: Number(stats?.referrerStats?.social ?? empty.referrerStats.social),
      external: Number(stats?.referrerStats?.external ?? empty.referrerStats.external),
      internal: Number(stats?.referrerStats?.internal ?? empty.referrerStats.internal),
    },
    deviceStats: {
      mobile: Number(stats?.deviceStats?.mobile ?? empty.deviceStats.mobile),
      tablet: Number(stats?.deviceStats?.tablet ?? empty.deviceStats.tablet),
      desktop: Number(stats?.deviceStats?.desktop ?? empty.deviceStats.desktop),
    },
    topPages: Array.isArray(stats?.topPages) ? stats!.topPages : [],
    topCategories: Array.isArray(stats?.topCategories) ? stats!.topCategories : [],
    topArticles: Array.isArray(stats?.topArticles) ? stats!.topArticles : [],
    visitsByHour: {
      ...createEmptyHourlyVisits(),
      ...(stats?.visitsByHour ?? {}),
    },
    visitsByDay: stats?.visitsByDay ?? {},
  };
}

export function normalizeRealtimeVisitors(data?: Partial<ApiRealtimeVisitors> | null): RealtimeVisitors {
  return {
    totalToday: Number(data?.total_today ?? 0),
    uniqueToday: Number(data?.unique_today ?? 0),
    activeNow: Number(data?.active_now ?? 0),
  };
}

export function normalizeVisitorExport(response: VisitorExportResponse['data']): VisitorExportData {
  return {
    rawData: response.raw_data,
    stats: normalizeVisitorStats(response.stats),
    exportedAt: response.exported_at,
    timeRange: response.time_range,
    totalRecords: Number(response.total_records ?? 0),
  };
}

/* -------------------------------------------------------------------------- */
/*                           CLIENT-SIDE HELPERS                              */
/* -------------------------------------------------------------------------- */

export function createPendingVisitorEvent(
  payload: TrackVisitorRequest,
  overrides?: Partial<PendingVisitorEvent>
): PendingVisitorEvent {
  return {
    ...payload,
    clientId: overrides?.clientId ?? `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    queuedAt: overrides?.queuedAt ?? new Date().toISOString(),
    retries: overrides?.retries ?? 0,
  };
}

export function formatVisitorAnalyticsError(
  error: unknown,
  fallbackMessage = 'An analytics error occurred.'
): string {
  if (typeof error === 'string') return error;

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return fallbackMessage;
}

/* -------------------------------------------------------------------------- */
/*                           EXPORT ALL TYPES                                 */
/* -------------------------------------------------------------------------- */

export default {
  VisitorPageTypes,
  VisitorReferrerTypes,
  VisitorDeviceTypes,
  VisitorAnalyticsTimeRanges,
  emptyVisitorStats,
  emptyRealtimeVisitors,
  createEmptyHourlyVisits,
  toVisitorLogModel,
  normalizeVisitorStats,
  normalizeRealtimeVisitors,
  normalizeVisitorExport,
  createPendingVisitorEvent,
  formatVisitorAnalyticsError,
};
