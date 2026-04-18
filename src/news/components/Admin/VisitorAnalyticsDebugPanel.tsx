import React, { useEffect, useMemo, useState } from 'react';
import {
  getLastTrackedPayload,
  getPendingVisitorEvents,
  getUniqueVisitorId,
  getVisitorSessionId,
  useRealtimeVisitors,
  useRefreshVisitorAnalytics,
  useTrackCurrentVisitor,
  useVisitorRecentEvents,
  useVisitorSyncStatus,
} from '../../api/visitor-analytics/VisitorAnalyticsQueries';

type LocalDebugSnapshot = {
  sessionId: string;
  uniqueVisitorId: string;
  currentPath: string;
  pendingCount: number;
  online: boolean;
  lastPayload: unknown;
};

const buildSnapshot = (): LocalDebugSnapshot => ({
  sessionId: getVisitorSessionId(),
  uniqueVisitorId: getUniqueVisitorId(),
  currentPath:
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/',
  pendingCount: getPendingVisitorEvents().length,
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastPayload: getLastTrackedPayload(),
});

const isDebugEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  const enabledByQuery = params.get('debugAnalytics') === '1';
  const enabledByStorage = window.localStorage.getItem('debug_visitor_analytics') === 'true';
  const isDev = import.meta.env.NODE_ENV !== 'production';

  return isDev || enabledByQuery || enabledByStorage;
};

const VisitorAnalyticsDebugPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<LocalDebugSnapshot>(buildSnapshot());
  const [message, setMessage] = useState<string | null>(null);

  const enabled = useMemo(() => isDebugEnabled(), []);

  const { data: syncStatus } = useVisitorSyncStatus();
  const { data: realtime } = useRealtimeVisitors();
  const { data: recentEvents = [], isFetching: isFetchingRecent } = useVisitorRecentEvents(12);
  const { refresh } = useRefreshVisitorAnalytics();

  const manualTrack = useTrackCurrentVisitor({
    onSuccess: () => {
      setMessage('Manual tracking event sent successfully.');
      setSnapshot(buildSnapshot());
    },
    onError: (errorMessage) => {
      setMessage(errorMessage);
      setSnapshot(buildSnapshot());
    },
  });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    const update = () => setSnapshot(buildSnapshot());

    update();

    const intervalId = window.setInterval(update, 1500);
    window.addEventListener('storage', update);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('storage', update);
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, [enabled]);

  if (!enabled) return null;

  const togglePersistDebug = () => {
    if (typeof window === 'undefined') return;

    const current = window.localStorage.getItem('debug_visitor_analytics') === 'true';
    window.localStorage.setItem('debug_visitor_analytics', current ? 'false' : 'true');

    setMessage(current ? 'Persistent debug mode disabled.' : 'Persistent debug mode enabled.');
  };

  const handleManualTrack = async () => {
    setMessage(null);

    await manualTrack.trackCurrentVisitorAsync({
      additionalData: {
        debugManualTrack: true,
        triggeredAt: new Date().toISOString(),
      },
    });

    await refresh();
    setSnapshot(buildSnapshot());
  };

  const handleRefresh = async () => {
    setMessage(null);
    await refresh();
    setSnapshot(buildSnapshot());
    setMessage('Analytics queries refreshed.');
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100] max-w-[92vw]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-slate-800"
      >
        {open ? 'Hide analytics debug' : 'Show analytics debug'}
      </button>

      {open ? (
        <div className="mt-3 w-[440px] max-w-[92vw] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
          <div className="border-b border-slate-800 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold">Visitor Analytics Debug Panel</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Verify route tracking, background queue sync, and backend persistence.
                </p>
              </div>
              <button
                type="button"
                onClick={togglePersistDebug}
                className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-900"
              >
                Persist toggle
              </button>
            </div>
          </div>

          <div className="max-h-[75vh] space-y-4 overflow-y-auto px-4 py-4">
            {message ? (
              <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300">
                {message}
              </div>
            ) : null}

            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Local client state
              </h4>
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Current path</span>
                  <span className="break-all text-right font-mono">{snapshot.currentPath}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Session ID</span>
                  <span className="break-all text-right font-mono">{snapshot.sessionId}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Unique visitor ID</span>
                  <span className="break-all text-right font-mono">{snapshot.uniqueVisitorId}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Pending queue</span>
                  <span>{snapshot.pendingCount}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Navigator online</span>
                  <span>{snapshot.online ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <p className="mb-1 text-slate-400">Last payload</p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-2 text-[11px] text-slate-300">
                    {JSON.stringify(snapshot.lastPayload, null, 2)}
                  </pre>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Live analytics state
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                  <p className="text-slate-400">Pending sync</p>
                  <p className="mt-1 text-lg font-bold text-amber-300">
                    {syncStatus?.pendingCount ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                  <p className="text-slate-400">Active now</p>
                  <p className="mt-1 text-lg font-bold text-emerald-300">
                    {realtime?.activeNow ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                  <p className="text-slate-400">Total today</p>
                  <p className="mt-1 text-lg font-bold text-blue-300">
                    {realtime?.totalToday ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                  <p className="text-slate-400">Unique today</p>
                  <p className="mt-1 text-lg font-bold text-violet-300">
                    {realtime?.uniqueToday ?? 0}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Last sync</span>
                  <span>
                    {syncStatus?.lastSyncTime
                      ? syncStatus.lastSyncTime.toLocaleString()
                      : 'Never'}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-slate-400">Sync mode</span>
                  <span>Automatic background sync</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleManualTrack}
                  disabled={manualTrack.isPending}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {manualTrack.isPending ? 'Tracking...' : 'Track current route'}
                </button>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Refresh queries
                </button>
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Recent backend events
                </h4>
                <span className="text-[11px] text-slate-500">
                  {isFetchingRecent ? 'Updating...' : 'Live'}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                {recentEvents.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-slate-400">
                    No recent visitor events returned yet.
                  </div>
                ) : (
                  <div className="max-h-[260px] overflow-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-950 text-slate-400">
                        <tr>
                          <th className="px-3 py-2 text-left">Time</th>
                          <th className="px-3 py-2 text-left">Page</th>
                          <th className="px-3 py-2 text-left">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvents.map((event) => (
                          <tr key={event.id} className="border-t border-slate-800">
                            <td className="whitespace-nowrap px-3 py-2">
                              {event.createdAt.toLocaleTimeString()}
                            </td>
                            <td className="break-all px-3 py-2 font-mono">{event.page}</td>
                            <td className="px-3 py-2">{event.pageType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VisitorAnalyticsDebugPanel;
