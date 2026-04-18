/**
 * VisitorAnalyticsQueries.ts
 * ============================================================================
 * VISITOR ANALYTICS REACT QUERY HOOKS
 * ============================================================================
 *
 * This file contains all React Query hooks and browser-side helpers for
 * visitor tracking, realtime stats, exports, optimistic queue syncing,
 * and analytics dashboard data retrieval.
 *
 * @module useVisitorAnalyticsQueries
 */

import { useEffect, useMemo } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { axiosInstance } from './../axiosConfig';
import type {
  PendingVisitorEvent,
  RealtimeVisitors,
  RealtimeVisitorsResponse,
  TrackVisitorOptions,
  TrackVisitorRequest,
  TrackVisitorResponse,
  VisitorAnalyticsTimeRange,
  VisitorCleanupResponse,
  VisitorExportData,
  VisitorExportResponse,
  VisitorStats,
  VisitorStatsResponse,
  VisitorSyncStatus,
  VisitorPageType,
  VisitorReferrerType,
  VisitorDeviceType,
} from './VisitorAnalyticsTypes';
import {
  createPendingVisitorEvent,
  emptyRealtimeVisitors,
  emptyVisitorStats,
  formatVisitorAnalyticsError,
  normalizeRealtimeVisitors,
  normalizeVisitorExport,
  normalizeVisitorStats,
} from './VisitorAnalyticsTypes';

/* -------------------------------------------------------------------------- */
/*                               QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const visitorAnalyticsKeys = {
  all: ['visitor-analytics'] as const,
  stats: {
    all: () => [...visitorAnalyticsKeys.all, 'stats'] as const,
    detail: (days: VisitorAnalyticsTimeRange | number) => [...visitorAnalyticsKeys.stats.all(), days] as const,
  },
  realtime: {
    all: () => [...visitorAnalyticsKeys.all, 'realtime'] as const,
  },
  sync: {
    all: () => [...visitorAnalyticsKeys.all, 'sync'] as const,
    status: () => [...visitorAnalyticsKeys.sync.all(), 'status'] as const,
  },
};

/* -------------------------------------------------------------------------- */
/*                             LOCAL STORAGE KEYS                             */
/* -------------------------------------------------------------------------- */

const VISITOR_SESSION_KEY = 'visitor_analytics_session_id';
const UNIQUE_VISITOR_KEY = 'visitor_analytics_unique_visitor_id';
const PENDING_EVENTS_KEY = 'visitor_analytics_pending_events';
const LAST_SYNC_KEY = 'visitor_analytics_last_sync';
const SESSION_TRACKED_KEY = 'visitor_analytics_session_tracked';

const AUTO_SYNC_INTERVAL_MS = 15_000;

/* -------------------------------------------------------------------------- */
/*                            BROWSER IDENTIFIERS                             */
/* -------------------------------------------------------------------------- */

export function generateVisitorClientId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorSessionId(): string {
  if (typeof window === 'undefined') return generateVisitorClientId();

  const existing = window.sessionStorage.getItem(VISITOR_SESSION_KEY);
  if (existing) return existing;

  const next = generateVisitorClientId();
  window.sessionStorage.setItem(VISITOR_SESSION_KEY, next);
  return next;
}

export function getUniqueVisitorId(): string {
  if (typeof window === 'undefined') return generateVisitorClientId();

  const existing = window.localStorage.getItem(UNIQUE_VISITOR_KEY);
  if (existing) return existing;

  const next = generateVisitorClientId();
  window.localStorage.setItem(UNIQUE_VISITOR_KEY, next);
  return next;
}

export function getDeviceType(): VisitorDeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function classifyReferrer(referrer?: string | null): VisitorReferrerType {
  if (!referrer || typeof window === 'undefined') return 'direct';

  try {
    const currentHost = window.location.hostname;
    const referrerUrl = new URL(referrer);

    if (referrerUrl.hostname === currentHost) return 'internal';

    const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex'];
    if (searchEngines.some((engine) => referrerUrl.hostname.includes(engine))) {
      return 'search';
    }

    const socialPlatforms = [
      'facebook',
      'twitter',
      'x.com',
      'linkedin',
      'instagram',
      'reddit',
      'pinterest',
      'tiktok',
      'youtube',
      'threads.net',
    ];

    if (socialPlatforms.some((platform) => referrerUrl.hostname.includes(platform))) {
      return 'social';
    }

    return 'external';
  } catch {
    return 'direct';
  }
}

export function getPageType(pathname: string): VisitorPageType {
  if (pathname === '/' || pathname === '/home') return 'landing';
  if (pathname.startsWith('/category/')) return 'category';
  if (pathname.startsWith('/article/')) return 'article';
  return 'other';
}

/* -------------------------------------------------------------------------- */
/*                            PENDING QUEUE HELPERS                           */
/* -------------------------------------------------------------------------- */

export function getPendingVisitorEvents(): PendingVisitorEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(PENDING_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingVisitorEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setPendingVisitorEvents(events: PendingVisitorEvent[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(events));
}

export function addPendingVisitorEvent(event: PendingVisitorEvent): void {
  const current = getPendingVisitorEvents();
  setPendingVisitorEvents([...current, event]);
}

export function removePendingVisitorEvent(clientId: string): void {
  const current = getPendingVisitorEvents();
  setPendingVisitorEvents(current.filter((item) => item.clientId !== clientId));
}

export function clearPendingVisitorEvents(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PENDING_EVENTS_KEY);
}

export function markVisitorSyncTime(date = new Date()): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LAST_SYNC_KEY, date.getTime().toString());
}

export function getVisitorSyncStatus(): VisitorSyncStatus {
  if (typeof window === 'undefined') {
    return {
      pendingCount: 0,
      lastSyncTime: null,
      isOnline: true,
    };
  }

  const lastSync = window.localStorage.getItem(LAST_SYNC_KEY);

  return {
    pendingCount: getPendingVisitorEvents().length,
    lastSyncTime: lastSync ? new Date(Number(lastSync)) : null,
    isOnline: window.navigator.onLine,
  };
}

export function hasCurrentSessionBeenTracked(): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(SESSION_TRACKED_KEY) === 'true';
}

export function markCurrentSessionTracked(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SESSION_TRACKED_KEY, 'true');
}

/* -------------------------------------------------------------------------- */
/*                               API CALLS                                    */
/* -------------------------------------------------------------------------- */

export async function trackVisitorApi(payload: TrackVisitorRequest): Promise<TrackVisitorResponse> {
  const response = await axiosInstance.post<TrackVisitorResponse>('/analytics/visitors/track', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

export async function getVisitorStatsApi(days: VisitorAnalyticsTimeRange | number): Promise<VisitorStats> {
  const response = await axiosInstance.get<VisitorStatsResponse>('/analytics/visitors/stats', {
    params: {
      days,
      _t: Date.now(),
    },
  });

  return normalizeVisitorStats(response.data.data);
}

export async function getRealtimeVisitorsApi(): Promise<RealtimeVisitors> {
  const response = await axiosInstance.get<RealtimeVisitorsResponse>('/analytics/visitors/realtime', {
    params: {
      _t: Date.now(),
    },
  });

  return normalizeRealtimeVisitors(response.data.data);
}

export async function exportVisitorDataApi(days: VisitorAnalyticsTimeRange | number): Promise<VisitorExportData> {
  const response = await axiosInstance.get<VisitorExportResponse>('/analytics/visitors/export', {
    params: {
      days,
      _t: Date.now(),
    },
  });

  return normalizeVisitorExport(response.data.data);
}

export async function cleanupVisitorDataApi(days = 30): Promise<VisitorCleanupResponse> {
  const response = await axiosInstance.delete<VisitorCleanupResponse>('/admin/analytics/visitors/cleanup', {
    data: { days },
  });
  return response.data;
}

/* -------------------------------------------------------------------------- */
/*                         OPTIMISTIC CACHE HELPERS                           */
/* -------------------------------------------------------------------------- */

function incrementTopPages(
  items: VisitorStats['topPages'],
  page: string,
  limit = 10
): VisitorStats['topPages'] {
  const map = new Map(items.map((item) => [item.page, item.views]));
  map.set(page, (map.get(page) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([entryPage, views]) => ({ page: entryPage, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

function incrementTopCategories(
  items: VisitorStats['topCategories'],
  categorySlug?: string | null,
  limit = 10
): VisitorStats['topCategories'] {
  if (!categorySlug) return items;

  const map = new Map(items.map((item) => [item.category, item.views]));
  map.set(categorySlug, (map.get(categorySlug) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([category, views]) => ({ category, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

function incrementTopArticles(
  items: VisitorStats['topArticles'],
  articleId?: string | null,
  limit = 10
): VisitorStats['topArticles'] {
  if (!articleId) return items;

  const normalizedArticleId = String(articleId);
  const map = new Map(items.map((item) => [item.articleId, item.views]));
  map.set(normalizedArticleId, (map.get(normalizedArticleId) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([entryArticleId, views]) => ({ articleId: entryArticleId, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

function applyOptimisticStatsUpdate(
  stats: VisitorStats | undefined,
  payload: TrackVisitorRequest
): VisitorStats {
  const base = normalizeVisitorStats(stats ?? emptyVisitorStats());
  const now = new Date();
  const hour = now.getHours();
  const dayKey = now.toISOString().split('T')[0];
  const shouldIncrementUnique = !hasCurrentSessionBeenTracked();

  return {
    ...base,
    totalVisits: base.totalVisits + 1,
    uniqueVisitors: base.uniqueVisitors + (shouldIncrementUnique ? 1 : 0),
    pageViews: {
      ...base.pageViews,
      [payload.pageType]: base.pageViews[payload.pageType] + 1,
    },
    referrerStats: {
      ...base.referrerStats,
      [payload.referrerType]: base.referrerStats[payload.referrerType] + 1,
    },
    deviceStats: {
      ...base.deviceStats,
      [payload.deviceType]: base.deviceStats[payload.deviceType] + 1,
    },
    topPages: incrementTopPages(base.topPages, payload.page),
    topCategories: incrementTopCategories(base.topCategories, payload.categorySlug),
    topArticles: incrementTopArticles(base.topArticles, payload.articleId),
    visitsByHour: {
      ...base.visitsByHour,
      [hour]: (base.visitsByHour[hour] ?? 0) + 1,
    },
    visitsByDay: {
      ...base.visitsByDay,
      [dayKey]: (base.visitsByDay[dayKey] ?? 0) + 1,
    },
  };
}

function applyOptimisticRealtimeUpdate(
  realtime: RealtimeVisitors | undefined
): RealtimeVisitors {
  const base = realtime ?? emptyRealtimeVisitors();
  const shouldIncrementUnique = !hasCurrentSessionBeenTracked();

  return {
    totalToday: base.totalToday + 1,
    uniqueToday: base.uniqueToday + (shouldIncrementUnique ? 1 : 0),
    activeNow: base.activeNow + 1,
  };
}

function updateSyncStatusCache(queryClient: QueryClient): void {
  queryClient.setQueryData(visitorAnalyticsKeys.sync.status(), getVisitorSyncStatus());
}

export async function invalidateVisitorAnalytics(queryClient: QueryClient): Promise<void> {
  updateSyncStatusCache(queryClient);
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: visitorAnalyticsKeys.stats.all() }),
    queryClient.invalidateQueries({ queryKey: visitorAnalyticsKeys.realtime.all() }),
    queryClient.invalidateQueries({ queryKey: visitorAnalyticsKeys.sync.status() }),
  ]);
}

/* -------------------------------------------------------------------------- */
/*                          PENDING QUEUE SYNCHRONIZER                        */
/* -------------------------------------------------------------------------- */

export async function flushPendingVisitorEvents(queryClient?: QueryClient): Promise<void> {
  if (typeof window === 'undefined' || !window.navigator.onLine) return;

  const pendingEvents = getPendingVisitorEvents();
  if (pendingEvents.length === 0) {
    if (queryClient) updateSyncStatusCache(queryClient);
    return;
  }

  const failedEvents: PendingVisitorEvent[] = [];

  for (const event of pendingEvents) {
    try {
      const { clientId, queuedAt, retries, ...payload } = event;
      void clientId;
      void queuedAt;
      void retries;
      await trackVisitorApi(payload);
    } catch {
      failedEvents.push({
        ...event,
        retries: event.retries + 1,
      });
    }
  }

  setPendingVisitorEvents(failedEvents);

  if (failedEvents.length !== pendingEvents.length) {
    markVisitorSyncTime();
    markCurrentSessionTracked();
  }

  if (queryClient) {
    await invalidateVisitorAnalytics(queryClient);
  }
}

export function buildTrackVisitorPayload(options?: TrackVisitorOptions): TrackVisitorRequest {
  const pathname = options?.page ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const referrer = typeof document !== 'undefined' ? document.referrer || null : null;

  return {
    sessionId: getVisitorSessionId(),
    uniqueVisitorId: getUniqueVisitorId(),
    page: pathname,
    pageType: getPageType(pathname),
    referrer,
    referrerType: classifyReferrer(referrer),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    screenResolution:
      typeof window !== 'undefined'
        ? `${window.screen.width}x${window.screen.height}`
        : undefined,
    deviceType: getDeviceType(),
    location: {
      timezone:
        typeof Intl !== 'undefined'
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : 'UTC',
    },
    categorySlug: options?.categorySlug,
    articleId: options?.articleId,
    additionalData: options?.additionalData,
  };
}

/* -------------------------------------------------------------------------- */
/*                                HOOKS                                       */
/* -------------------------------------------------------------------------- */

export const useVisitorStats = (
  days: VisitorAnalyticsTimeRange | number,
  options?: Omit<UseQueryOptions<VisitorStats, AxiosError<VisitorStatsResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<VisitorStats, AxiosError<VisitorStatsResponse>>({
    queryKey: visitorAnalyticsKeys.stats.detail(days),
    queryFn: () => getVisitorStatsApi(days),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30_000,
    retry: 1,
    placeholderData: emptyVisitorStats(),
    ...options,
  });
};

export const useRealtimeVisitors = (
  options?: Omit<UseQueryOptions<RealtimeVisitors, AxiosError<RealtimeVisitorsResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<RealtimeVisitors, AxiosError<RealtimeVisitorsResponse>>({
    queryKey: visitorAnalyticsKeys.realtime.all(),
    queryFn: getRealtimeVisitorsApi,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 15_000,
    retry: 1,
    placeholderData: emptyRealtimeVisitors(),
    ...options,
  });
};

export const useVisitorSyncStatus = () => {
  return useQuery<VisitorSyncStatus>({
    queryKey: visitorAnalyticsKeys.sync.status(),
    queryFn: async () => getVisitorSyncStatus(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 5_000,
    initialData: getVisitorSyncStatus(),
  });
};

export const useTrackVisitor = (
  callbacks?: {
    onSuccess?: (data: TrackVisitorResponse) => void;
    onError?: (error: AxiosError<TrackVisitorResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<
    TrackVisitorResponse,
    AxiosError<TrackVisitorResponse>,
    TrackVisitorRequest,
    { pendingEvent: PendingVisitorEvent }
  >({
    mutationFn: async (payload) => trackVisitorApi(payload),
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: visitorAnalyticsKeys.stats.all() }),
        queryClient.cancelQueries({ queryKey: visitorAnalyticsKeys.realtime.all() }),
      ]);

      const pendingEvent = createPendingVisitorEvent(payload);
      addPendingVisitorEvent(pendingEvent);

      const existingStats = queryClient.getQueriesData<VisitorStats>({
        queryKey: visitorAnalyticsKeys.stats.all(),
      });

      existingStats.forEach(([queryKey, currentStats]) => {
        queryClient.setQueryData(queryKey, applyOptimisticStatsUpdate(currentStats, payload));
      });

      queryClient.setQueryData<RealtimeVisitors>(
        visitorAnalyticsKeys.realtime.all(),
        (current) => applyOptimisticRealtimeUpdate(current)
      );

      updateSyncStatusCache(queryClient);

      return { pendingEvent };
    },
    onSuccess: (data, _payload, context) => {
      removePendingVisitorEvent(context.pendingEvent.clientId);
      markVisitorSyncTime();
      markCurrentSessionTracked();
      updateSyncStatusCache(queryClient);
      void invalidateVisitorAnalytics(queryClient);
      callbacks?.onSuccess?.(data);
    },
    onError: (error, _payload, context) => {
      if (context?.pendingEvent) {
        const current = getPendingVisitorEvents();
        const updated = current.map((item) =>
          item.clientId === context.pendingEvent.clientId
            ? { ...item, retries: item.retries + 1 }
            : item
        );
        setPendingVisitorEvents(updated);
        updateSyncStatusCache(queryClient);
      }
      callbacks?.onError?.(error);
    },
    onSettled: async () => {
      await invalidateVisitorAnalytics(queryClient);
    },
  });
};

export const useTrackCurrentVisitor = (
  callbacks?: {
    onSuccess?: (data: TrackVisitorResponse) => void;
    onError?: (message: string) => void;
  }
) => {
  const trackVisitorMutation = useTrackVisitor({
    onSuccess: callbacks?.onSuccess,
    onError: (error) => {
      callbacks?.onError?.(formatVisitorAnalyticsError(error, 'Failed to track visitor.'));
    },
  });

  return useMemo(
    () => ({
      ...trackVisitorMutation,
      trackCurrentVisitor: (options?: TrackVisitorOptions) => {
        const payload = buildTrackVisitorPayload(options);
        trackVisitorMutation.mutate(payload);
      },
      trackCurrentVisitorAsync: async (options?: TrackVisitorOptions) => {
        const payload = buildTrackVisitorPayload(options);
        return trackVisitorMutation.mutateAsync(payload);
      },
    }),
    [trackVisitorMutation]
  );
};

export const useExportVisitorData = (
  callbacks?: {
    onSuccess?: (data: VisitorExportData) => void;
    onError?: (error: AxiosError<VisitorExportResponse>) => void;
  }
) => {
  return useMutation<VisitorExportData, AxiosError<VisitorExportResponse>, VisitorAnalyticsTimeRange | number>({
    mutationFn: (days) => exportVisitorDataApi(days),
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
};

export const useCleanupVisitorData = (
  callbacks?: {
    onSuccess?: (data: VisitorCleanupResponse) => void;
    onError?: (error: AxiosError<VisitorCleanupResponse>) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<VisitorCleanupResponse, AxiosError<VisitorCleanupResponse>, number>({
    mutationFn: (days = 30) => cleanupVisitorDataApi(days),
    onSuccess: async (data) => {
      await invalidateVisitorAnalytics(queryClient);
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
};

export const useForceSyncVisitorEvents = (
  callbacks?: {
    onSuccess?: () => void;
    onError?: (message: string) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await flushPendingVisitorEvents(queryClient);
    },
    onSuccess: () => {
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(formatVisitorAnalyticsError(error, 'Failed to sync pending visitor events.'));
    },
  });
};

export const useRefreshVisitorAnalytics = () => {
  const queryClient = useQueryClient();

  return useMemo(
    () => ({
      refresh: async () => {
        await invalidateVisitorAnalytics(queryClient);
      },
    }),
    [queryClient]
  );
};

export const useInitializeVisitorAnalyticsSync = (): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const trySync = () => {
      void flushPendingVisitorEvents(queryClient);
    };

    trySync();

    const intervalId = window.setInterval(trySync, AUTO_SYNC_INTERVAL_MS);

    const handleOnline = () => {
      trySync();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trySync();
      }
    };

    const handleBeforeUnload = () => {
      const pending = getPendingVisitorEvents();
      const latestPending = pending[pending.length - 1];
      if (!latestPending || !navigator.sendBeacon) return;

      const { clientId, queuedAt, retries, ...payload } = latestPending;
      void clientId;
      void queuedAt;
      void retries;

      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      });

      navigator.sendBeacon('/api/analytics/visitors/track', blob);
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [queryClient]);
};

/* -------------------------------------------------------------------------- */
/*                              FILE EXPORTER                                 */
/* -------------------------------------------------------------------------- */

export function downloadVisitorExport(data: VisitorExportData, fileName?: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download =
    fileName ?? `visitor-analytics-${new Date().toISOString().split('T')[0]}.json`;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------- */
/*                            EXPORT ALL HOOKS                                */
/* -------------------------------------------------------------------------- */

export default {
  visitorAnalyticsKeys,
  useVisitorStats,
  useRealtimeVisitors,
  useVisitorSyncStatus,
  useTrackVisitor,
  useTrackCurrentVisitor,
  useExportVisitorData,
  useCleanupVisitorData,
  useForceSyncVisitorEvents,
  useRefreshVisitorAnalytics,
  useInitializeVisitorAnalyticsSync,
  buildTrackVisitorPayload,
  flushPendingVisitorEvents,
  invalidateVisitorAnalytics,
  downloadVisitorExport,
  getVisitorSyncStatus,
  getPendingVisitorEvents,
  clearPendingVisitorEvents,
  generateVisitorClientId,
  getVisitorSessionId,
  getUniqueVisitorId,
  getPageType,
  classifyReferrer,
  getDeviceType,
};
