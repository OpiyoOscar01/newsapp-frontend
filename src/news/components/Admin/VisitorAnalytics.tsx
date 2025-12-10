import React, { useState, useEffect } from 'react';
import { 
  getVisitorStats, 
  exportVisitorDataForBackend, 
  clearOldVisitorData,
  type VisitorStats 
} from '../../utils/visitorTracking';

const VisitorAnalytics: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = () => {
    setLoading(true);
    try {
      const visitorStats = getVisitorStats(timeRange);
      setStats(visitorStats);
    } catch (error) {
      console.error('Error loading visitor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const exportData = exportVisitorDataForBackend();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearOldData = () => {
    if (window.confirm('Clear visitor data older than 30 days?')) {
      clearOldVisitorData(30);
      loadStats();
      alert('Old data cleared successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-gray-500">
        No visitor data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visitor Analytics</h2>
          <p className="text-gray-600">Track visitor behavior and site performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value) as 7 | 30 | 90)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            Export Data
          </button>
          
          <button
            onClick={handleClearOldData}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Clear Old
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVisits}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniqueVisitors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Article Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pageViews.article}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Category Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pageViews.category}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Page Views Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Page Views Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.pageViews.landing}</p>
            <p className="text-sm text-gray-600">Landing Page</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.pageViews.category}</p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.pageViews.article}</p>
            <p className="text-sm text-gray-600">Articles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.pageViews.other}</p>
            <p className="text-sm text-gray-600">Other Pages</p>
          </div>
        </div>
      </div>

      {/* Referrer Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {Object.entries(stats.referrerStats).map(([source, count]) => {
              const total = Object.values(stats.referrerStats).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
              
              return (
                <div key={source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="capitalize text-gray-700 min-w-[80px]">{source}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-4 min-w-[60px] text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Device Types</h3>
          <div className="space-y-3">
            {Object.entries(stats.deviceStats).map(([device, count]) => {
              const total = Object.values(stats.deviceStats).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
              
              return (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="capitalize text-gray-700 min-w-[80px]">{device}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          device === 'mobile' ? 'bg-green-600' :
                          device === 'tablet' ? 'bg-orange-600' :
                          'bg-purple-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-4 min-w-[60px] text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.topPages.slice(0, 5).map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                    {page.page}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    {page.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Categories and Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.topCategories.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
            <div className="space-y-2">
              {stats.topCategories.slice(0, 5).map((cat, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-gray-700 capitalize">{cat.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{cat.views} views</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.topArticles.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Top Articles</h3>
            <div className="space-y-2">
              {stats.topArticles.slice(0, 5).map((art, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-gray-700 font-mono text-sm truncate">{art.articleId}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-2">{art.views} views</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hourly Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Visits by Hour (24h)</h3>
        <div className="flex items-end justify-between space-x-1 h-32">
          {Array.from({ length: 24 }, (_, i) => {
            const count = stats.visitsByHour[i] || 0;
            const maxCount = Math.max(...Object.values(stats.visitsByHour), 1);
            const height = (count / maxCount) * 100;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                  title={`${i}:00 - ${count} visits`}
                />
                <span className="text-xs text-gray-500 mt-1">{i}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisitorAnalytics;
