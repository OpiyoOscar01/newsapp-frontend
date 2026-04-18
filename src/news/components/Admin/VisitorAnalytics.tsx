/**
 * VisitorAnalytics.tsx
 * ============================================================================
 * VISITOR ANALYTICS DASHBOARD COMPONENT
 * ============================================================================
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
  useRealtimeVisitors,
  useRefreshVisitorAnalytics,
  useVisitorStats,
  useVisitorSyncStatus,
} from '../../api/visitor-analytics/VisitorAnalyticsQueries';
import {
  VisitorAnalyticsTimeRanges,
  emptyRealtimeVisitors,
  emptyVisitorStats,
} from '../../api/visitor-analytics/VisitorAnalyticsTypes';
import type {
  VisitorAnalyticsTimeRange,
  VisitorStats,
} from '../../api/visitor-analytics/VisitorAnalyticsTypes';
import {
  TrendingUp,
  Users,
  FileText,
  FolderOpen,
  RefreshCw,
  Download,
  Trash2,
  AlertCircle,
  Wifi,
  WifiOff,
  Clock,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Calendar,
  Award,
  Star,
  ChevronRight,
  Loader2,
} from 'lucide-react';

const PAGE_VIEW_COLORS = ['#2563eb', '#16a34a', '#9333ea', '#f97316'];
const REFERRER_COLORS = ['#2563eb', '#0ea5e9', '#8b5cf6', '#f97316', '#64748b'];
const DEVICE_COLORS = ['#16a34a', '#f59e0b', '#7c3aed'];

const formatNumber = (value: number): string => value.toLocaleString();

const StatCard: React.FC<{
  title: string;
  value: number;
  accentClass: string;
  subtitle?: string;
  icon?: React.ReactNode;
}> = ({ title, value, accentClass, subtitle, icon }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon && <div className="text-gray-400">{icon}</div>}
            <p className="text-sm font-medium text-gray-500">{title}</p>
          </div>
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
  icon?: React.ReactNode;
}> = ({ title, description, children, icon }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-500">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
      </div>
      {children}
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
    <div className="text-center">
      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
      <p>{message}</p>
    </div>
  </div>
);

const buildVisitsByHourChart = (stats: VisitorStats) =>
  Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    visits: stats.visitsByHour[hour] ?? 0,
  }));

const buildVisitsByDayChart = (stats: VisitorStats) =>
  Object.entries(stats.visitsByDay)
    .sort(([dayA], [dayB]) => new Date(dayA).getTime() - new Date(dayB).getTime())
    .map(([date, visits]) => ({
      date,
      visits,
    }));

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
  const [timeRange, setTimeRange] = useState<VisitorAnalyticsTimeRange>(
    VisitorAnalyticsTimeRanges.SEVEN_DAYS
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    data: stats = emptyVisitorStats(),
    isLoading,
    isFetching,
    error,
  } = useVisitorStats(timeRange);

  const {
    data: realtime = emptyRealtimeVisitors(),
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

  const isBusy = isFetching || exportMutation.isPending || cleanupMutation.isPending;
  const pageLoadError =
    error instanceof Error ? error.message : 'Failed to load visitor analytics.';

  const handleRefresh = async () => {
    setFeedbackMessage(null);
    await refresh();
  };

  const handleExport = async () => {
    setFeedbackMessage(null);
    await exportMutation.mutateAsync(timeRange);
  };

  const handleCleanup = async () => {
    const confirmed = window.confirm(
      'Delete visitor analytics data older than 30 days from the backend?'
    );

    if (!confirmed) return;

    setFeedbackMessage(null);
    await cleanupMutation.mutateAsync(30);
  };

  const totalReferrers = Object.values(stats.referrerStats).reduce(
    (sum, count) => sum + count,
    0
  );

  const totalDevices = Object.values(stats.deviceStats).reduce(
    (sum, count) => sum + count,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center cursor-pointer">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-sm font-medium text-red-700">{pageLoadError}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const isZeroState =
    stats.totalVisits === 0 &&
    stats.uniqueVisitors === 0 &&
    realtime.totalToday === 0 &&
    (syncStatus?.pendingCount ?? 0) === 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">DefinePress Visitor Analytics</h2>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 flex items-center gap-1 cursor-default">
                <Eye className="h-3 w-3" />
                Total today: {formatNumber(realtime.totalToday)}
              </span>
              <span className="rounded-full bg-violet-50 px-3 py-1 font-medium text-violet-700 flex items-center gap-1 cursor-default">
                <Users className="h-3 w-3" />
                Unique today: {formatNumber(realtime.uniqueToday)}
              </span>
              {(syncStatus?.pendingCount ?? 0) > 0 ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 flex items-center gap-1 cursor-default">
                  <Clock className="h-3 w-3" />
                  Pending auto-sync: {formatNumber(syncStatus?.pendingCount ?? 0)}
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 flex items-center gap-1 cursor-default">
                  <Zap className="h-3 w-3" />
                  Sync queue empty
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={timeRange}
              onChange={(event) =>
                setTimeRange(Number(event.target.value) as VisitorAnalyticsTimeRange)
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
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
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </button>

            <button
              onClick={handleExport}
              disabled={exportMutation.isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {exportMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export data
                </>
              )}
            </button>

            <button
              onClick={handleCleanup}
              disabled={cleanupMutation.isPending}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {cleanupMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cleaning...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Cleanup old data
                </>
              )}
            </button>
          </div>
        </div>

        {isZeroState ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2 cursor-pointer">
            <AlertCircle className="h-4 w-4" />
            <p>No persisted visitor activity is showing yet. Browse the app in another tab or use the debug panel to trigger a manual test event and verify the tracking pipeline.</p>
          </div>
        ) : null}

        {(feedbackMessage || syncStatus?.lastSyncTime || isRealtimeFetching) && (
          <div className="mt-4 space-y-2">
            {feedbackMessage ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex items-center gap-2 cursor-pointer">
                <AlertCircle className="h-4 w-4" />
                {feedbackMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                {syncStatus?.isOnline ? (
                  <Wifi className="h-3 w-3 text-green-600" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-600" />
                )}
                Network: {syncStatus?.isOnline ? 'Online' : 'Offline'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last sync: {syncStatus?.lastSyncTime
                  ? syncStatus.lastSyncTime.toLocaleString()
                  : 'Never'}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {isRealtimeFetching
                  ? 'Realtime metrics updating…'
                  : 'Realtime metrics up to date'}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Sync mode: automatic
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Total Visits" 
          value={stats.totalVisits} 
          accentClass="bg-blue-500"
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard
          title="Unique Visitors"
          value={stats.uniqueVisitors}
          accentClass="bg-emerald-500"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Article Views"
          value={stats.pageViews.article}
          accentClass="bg-violet-500"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Category Views"
          value={stats.pageViews.category}
          accentClass="bg-amber-500"
          icon={<FolderOpen className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="Visits by Day"
          description="Daily traffic trend for the selected reporting window."
          icon={<Calendar className="h-5 w-5" />}
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
          icon={<Clock className="h-5 w-5" />}
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
        <SectionCard
          title="Page Views Breakdown"
          description="Distribution of page types across visits."
          icon={<PieChartIcon className="h-5 w-5" />}
        >
          {pageViewsChart.some((item) => item.value > 0) ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pageViewsChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {pageViewsChart.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PAGE_VIEW_COLORS[index % PAGE_VIEW_COLORS.length]}
                      />
                    ))}
                  </Pie>
              <Tooltip formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />                 
          <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No page view data available yet." />
          )}
        </SectionCard>

        <SectionCard 
          title="Traffic Sources" 
          description="Referrer mix for the selected period."
          icon={<Globe className="h-5 w-5" />}
        >
          {referrerChart.some((item) => item.value > 0) ? (
            <div className="space-y-4">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referrerChart} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                    <Tooltip formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {referrerChart.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={REFERRER_COLORS[index % REFERRER_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {referrerChart.map((item) => {
                  const percentage =
                    totalReferrers > 0
                      ? ((item.value / totalReferrers) * 100).toFixed(1)
                      : '0.0';

                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
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

        <SectionCard 
          title="Device Types" 
          description="Device distribution for active visitors."
          icon={<Smartphone className="h-5 w-5" />}
        >
          {deviceChart.some((item) => item.value > 0) ? (
            <div className="space-y-4">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceChart} dataKey="value" nameKey="name" outerRadius={100}>
                      {deviceChart.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                      <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {deviceChart.map((item) => {
                  const percentage =
                    totalDevices > 0
                      ? ((item.value / totalDevices) * 100).toFixed(1)
                      : '0.0';

                  return (
                    <div key={item.name} className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        {item.name === 'Mobile' && <Smartphone className="h-4 w-4 text-gray-500" />}
                        {item.name === 'Tablet' && <Tablet className="h-4 w-4 text-gray-500" />}
                        {item.name === 'Desktop' && <Monitor className="h-4 w-4 text-gray-500" />}
                        <span className="text-gray-600">{item.name}</span>
                      </div>
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
        <SectionCard 
          title="Top Pages" 
          description="Most visited pages in the selected period."
          icon={<Award className="h-5 w-5" />}
        >
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
                      <tr key={page.page} className="hover:bg-gray-50 cursor-pointer transition-colors">
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

        <SectionCard 
          title="Top Categories" 
          description="Highest-performing category pages."
          icon={<Star className="h-5 w-5" />}
        >
          {stats.topCategories.length > 0 ? (
            <div className="space-y-3">
              {stats.topCategories.slice(0, 8).map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-gray-400" />
                    <span className="truncate text-sm font-medium capitalize text-gray-700">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(item.views)} views
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No category performance data available yet." />
          )}
        </SectionCard>

        <SectionCard 
              title="Top Articles" 
              description="Most viewed article entries."
              icon={<TrendingUp className="h-5 w-5" />}
            >
              {stats.topArticles.length > 0 ? (
                <div className="space-y-3">
                  {stats.topArticles.slice(0, 8).map((item) => (
                    <div
                      key={item.articleId}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 break-words">
                          {item.articleId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {formatNumber(item.views)} views
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </div>
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