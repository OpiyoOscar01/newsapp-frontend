/**
 * VisitorAnalytics.tsx
 * ============================================================================
 * VISITOR ANALYTICS DASHBOARD COMPONENT
 * ============================================================================
 *
 * This component consumes the visitor analytics React Query hooks directly,
 * keeps data fresh with no frontend caching, supports optimistic sync status,
 * and renders charts using Recharts.
 */

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  downloadVisitorExport,
  useCleanupVisitorData,
  useExportVisitorData,
  useForceSyncVisitorEvents,
  useInitializeVisitorAnalyticsSync,
  useRealtimeVisitors,
  useRefreshVisitorAnalytics,
  useVisitorStats,
  useVisitorSyncStatus,
} from '../../api/visitor-analytics/VisitorAnalyticsQueries';
import type {
  VisitorAnalyticsTimeRange,
  VisitorStats,
} from '../../api/visitor-analytics/VisitorAnalyticsTypes';
import { VisitorAnalyticsTimeRanges } from '../../api/visitor-analytics/VisitorAnalyticsTypes';

const PAGE_VIEW_COLORS = ['#2563eb', '#16a34a', '#9333ea', '#f97316'];
const REFERRER_COLORS = ['#2563eb', '#0ea5e9', '#8b5cf6', '#f97316', '#64748b'];
const DEVICE_COLORS = ['#16a34a', '#f59e0b', '#7c3aed'];

const formatNumber = (value: number): string => value.toLocaleString();

const StatCard: React.FC<{
  title: string;
  value: number;
  accentClass: string;
  subtitle?: string;
}> = ({ title, value, accentClass, subtitle }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatNumber(value)}</p>
          {subtitle ? <p className="mt-2 text-xs text-gray-500">{subtitle}</p> : null}
        </div>
        <div className={`h-3 w-3 rounded-full ${accentClass}`} />
      </div>
    </div>
  );
};

const SectionCard: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
      </div>
      {children}
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
    {message}
  </div>
);

const buildVisitsByHourChart = (stats: VisitorStats) => {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    visits: stats.visitsByHour[hour] ?? 0,
  }));
};

const buildVisitsByDayChart = (stats: VisitorStats) => {
  return Object.entries(stats.visitsByDay)
    .sort(([dayA], [dayB]) => new Date(dayA).getTime() - new Date(dayB).getTime())
    .map(([date, visits]) => ({
      date,
      visits,
    }));
};

const buildPageViewsChart = (stats: VisitorStats) => [
  { name: 'Landing', value: stats.pageViews.landing },
  { name: 'Category', value: stats.pageViews.category },
  { name: 'Article', value: stats.pageViews.article },
  { name: 'Other', value: stats.pageViews.other },
];

const buildReferrerChart = (stats: VisitorStats) => [
  { name: 'Direct', value: stats.referrerStats.direct },
  { name: 'Search', value: stats.referrerStats.search },
  { name: 'Social', value: stats.referrerStats.social },
  { name: 'External', value: stats.referrerStats.external },
  { name: 'Internal', value: stats.referrerStats.internal },
];

const buildDeviceChart = (stats: VisitorStats) => [
  { name: 'Mobile', value: stats.deviceStats.mobile },
  { name: 'Tablet', value: stats.deviceStats.tablet },
  { name: 'Desktop', value: stats.deviceStats.desktop },
];

const TIME_RANGE_OPTIONS: Array<{ label: string; value: VisitorAnalyticsTimeRange }> = [
  { label: 'Last 7 days', value: VisitorAnalyticsTimeRanges.SEVEN_DAYS },
  { label: 'Last 30 days', value: VisitorAnalyticsTimeRanges.THIRTY_DAYS },
  { label: 'Last 90 days', value: VisitorAnalyticsTimeRanges.NINETY_DAYS },
];

const VisitorAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<VisitorAnalyticsTimeRange>(VisitorAnalyticsTimeRanges.SEVEN_DAYS);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useInitializeVisitorAnalyticsSync();

  const {
    data: stats = {
      totalVisits: 0,
      uniqueVisitors: 0,
      pageViews: { landing: 0, category: 0, article: 0, other: 0 },
      referrerStats: { direct: 0, search: 0, social: 0, external: 0, internal: 0 },
      deviceStats: { mobile: 0, tablet: 0, desktop: 0 },
      topPages: [],
      topCategories: [],
      topArticles: [],
      visitsByHour: {},
      visitsByDay: {},
    },
    isLoading,
    isFetching,
    error,
  } = useVisitorStats(timeRange);

  const {
    data: realtime = {
      totalToday: 0,
      uniqueToday: 0,
      activeNow: 0,
    },
    isFetching: isRealtimeFetching,
  } = useRealtimeVisitors();

  const { data: syncStatus } = useVisitorSyncStatus();
  const { refresh } = useRefreshVisitorAnalytics();

  const exportMutation = useExportVisitorData({
    onSuccess: (data) => {
      downloadVisitorExport(data);
      setFeedbackMessage('Visitor analytics export downloaded successfully.');
    },
    onError: () => {
      setFeedbackMessage('Failed to export visitor analytics data.');
    },
  });

  const forceSyncMutation = useForceSyncVisitorEvents({
    onSuccess: () => {
      setFeedbackMessage('Pending visitor events synced successfully.');
    },
    onError: (message) => {
      setFeedbackMessage(message);
    },
  });

  const cleanupMutation = useCleanupVisitorData({
    onSuccess: (data) => {
      setFeedbackMessage(data.message || 'Old visitor data cleanup completed successfully.');
    },
    onError: () => {
      setFeedbackMessage('Failed to cleanup old visitor data.');
    },
  });

  const visitsByHourChart = useMemo(() => buildVisitsByHourChart(stats), [stats]);
  const visitsByDayChart = useMemo(() => buildVisitsByDayChart(stats), [stats]);
  const pageViewsChart = useMemo(() => buildPageViewsChart(stats), [stats]);
  const referrerChart = useMemo(() => buildReferrerChart(stats), [stats]);
  const deviceChart = useMemo(() => buildDeviceChart(stats), [stats]);

  const isBusy = isFetching || exportMutation.isPending || forceSyncMutation.isPending || cleanupMutation.isPending;
  const pageLoadError = error instanceof Error ? error.message : 'Failed to load visitor analytics.';

  const handleRefresh = async () => {
    setFeedbackMessage(null);
    await refresh();
  };

  const handleExport = async () => {
    setFeedbackMessage(null);
    await exportMutation.mutateAsync(timeRange);
  };

  const handleForceSync = async () => {
    setFeedbackMessage(null);
    await forceSyncMutation.mutateAsync();
  };

  const handleCleanup = async () => {
    const confirmed = window.confirm(
      'Delete visitor analytics data older than 30 days from the backend?'
    );

    if (!confirmed) return;

    setFeedbackMessage(null);
    await cleanupMutation.mutateAsync(30);
  };

  const totalReferrers = Object.values(stats.referrerStats).reduce((sum, count) => sum + count, 0);
  const totalDevices = Object.values(stats.deviceStats).reduce((sum, count) => sum + count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm font-medium text-red-700">{pageLoadError}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visitor Analytics</h2>
            <p className="mt-1 text-sm text-gray-500">
              Real-time dashboard powered by React Query hooks, optimistic tracking, and Recharts.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                Active now: {formatNumber(realtime.activeNow)}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                Total today: {formatNumber(realtime.totalToday)}
              </span>
              <span className="rounded-full bg-violet-50 px-3 py-1 font-medium text-violet-700">
                Unique today: {formatNumber(realtime.uniqueToday)}
              </span>
              {syncStatus?.pendingCount ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
                  Pending sync: {formatNumber(syncStatus.pendingCount)}
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                  Sync queue empty
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={timeRange}
              onChange={(event) => setTimeRange(Number(event.target.value) as VisitorAnalyticsTimeRange)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={isBusy}
            >
              {TIME_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              disabled={isBusy}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              onClick={handleForceSync}
              disabled={forceSyncMutation.isPending}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {forceSyncMutation.isPending ? 'Syncing...' : 'Sync now'}
            </button>

            <button
              onClick={handleExport}
              disabled={exportMutation.isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportMutation.isPending ? 'Exporting...' : 'Export data'}
            </button>

            <button
              onClick={handleCleanup}
              disabled={cleanupMutation.isPending}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cleanupMutation.isPending ? 'Cleaning...' : 'Cleanup old data'}
            </button>
          </div>
        </div>

        {(feedbackMessage || syncStatus?.lastSyncTime || isRealtimeFetching) && (
          <div className="mt-4 space-y-2">
            {feedbackMessage ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {feedbackMessage}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>
                Network: {syncStatus?.isOnline ? 'Online' : 'Offline'}
              </span>
              <span>
                Last sync:{' '}
                {syncStatus?.lastSyncTime ? syncStatus.lastSyncTime.toLocaleString() : 'Never'}
              </span>
              <span>{isRealtimeFetching ? 'Realtime metrics updating…' : 'Realtime metrics up to date'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Visits" value={stats.totalVisits} accentClass="bg-blue-500" />
        <StatCard title="Unique Visitors" value={stats.uniqueVisitors} accentClass="bg-emerald-500" />
        <StatCard title="Article Views" value={stats.pageViews.article} accentClass="bg-violet-500" />
        <StatCard title="Category Views" value={stats.pageViews.category} accentClass="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="Visits by Day"
          description="Daily traffic trend for the selected reporting window."
        >
          {visitsByDayChart.length > 0 ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitsByDayChart}>
                  <defs>
                    <linearGradient id="visitsByDayFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="url(#visitsByDayFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No daily visit data available for this period." />
          )}
        </SectionCard>

        <SectionCard
          title="Visits by Hour"
          description="Hourly distribution of page visits based on the selected range."
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitsByHourChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={1} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="visits" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="Page Views Breakdown" description="Distribution of page types across visits.">
          {pageViewsChart.some((item) => item.value > 0) ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pageViewsChart} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                    {pageViewsChart.map((entry, index) => (
                      <Cell key={entry.name} fill={PAGE_VIEW_COLORS[index % PAGE_VIEW_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No page view data available yet." />
          )}
        </SectionCard>

        <SectionCard title="Traffic Sources" description="Referrer mix for the selected period.">
          {referrerChart.some((item) => item.value > 0) ? (
            <div className="space-y-4">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referrerChart} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                    <Tooltip formatter={(value: number) => value.toLocaleString()} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {referrerChart.map((entry, index) => (
                        <Cell key={entry.name} fill={REFERRER_COLORS[index % REFERRER_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {referrerChart.map((item) => {
                  const percentage = totalReferrers > 0 ? ((item.value / totalReferrers) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium text-gray-900">
                        {formatNumber(item.value)} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState message="No traffic source data available yet." />
          )}
        </SectionCard>

        <SectionCard title="Device Types" description="Device distribution for active visitors.">
          {deviceChart.some((item) => item.value > 0) ? (
            <div className="space-y-4">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceChart} dataKey="value" nameKey="name" outerRadius={100}>
                      {deviceChart.map((entry, index) => (
                        <Cell key={entry.name} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toLocaleString()} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {deviceChart.map((item) => {
                  const percentage = totalDevices > 0 ? ((item.value / totalDevices) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium text-gray-900">
                        {formatNumber(item.value)} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState message="No device type data available yet." />
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SectionCard title="Top Pages" description="Most visited pages in the selected period.">
          {stats.topPages.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-100">
              <div className="max-h-[320px] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Page
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Views
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {stats.topPages.slice(0, 10).map((page) => (
                      <tr key={page.page} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm text-gray-700">{page.page}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          {formatNumber(page.views)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState message="No page rankings available yet." />
          )}
        </SectionCard>

        <SectionCard title="Top Categories" description="Highest-performing category pages.">
          {stats.topCategories.length > 0 ? (
            <div className="space-y-3">
              {stats.topCategories.slice(0, 8).map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50"
                >
                  <span className="truncate text-sm font-medium capitalize text-gray-700">
                    {item.category}
                  </span>
                  <span className="ml-4 text-sm font-semibold text-gray-900">
                    {formatNumber(item.views)} views
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No category performance data available yet." />
          )}
        </SectionCard>

        <SectionCard title="Top Articles" description="Most viewed article entries.">
          {stats.topArticles.length > 0 ? (
            <div className="space-y-3">
              {stats.topArticles.slice(0, 8).map((item) => (
                <div
                  key={item.articleId}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50"
                >
                  <span className="truncate font-mono text-sm text-gray-700">{item.articleId}</span>
                  <span className="ml-4 text-sm font-semibold text-gray-900">
                    {formatNumber(item.views)} views
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No article performance data available yet." />
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default VisitorAnalytics;
