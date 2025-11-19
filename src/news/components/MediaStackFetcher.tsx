// src/components/Admin/MediaStackFetcher.tsx
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api/client';

// ---- Type Definitions ----
interface MediaStackStatusResponse {
  active: boolean;
}

interface MediaStackUsageStatsResponse {
  remaining_requests: number;
  month: string;
  request_count: number;
  plan: string;
}

interface MediaStackTestConnectionResponse {
  message: string;
}

interface MediaStackFetchResponse {
  message: string;
  articles_fetched: number;
  articles_saved: number;
  data: unknown;
}

interface SyncArticlesResponse {
  message: string;
  data?: unknown;
}

interface FetchResult {
  success: boolean;
  message: string;
  data?: unknown;
  articlesFetched?: number;
  articlesSaved?: number;
}

interface ApiStatus {
  isActive: boolean;
  remainingRequests?: number;
  usageStats?: MediaStackUsageStatsResponse | null;
}

// ---- Constants ----
const NEWS_CATEGORIES = [
  'general', 'business', 'entertainment', 
  'health', 'science', 'sports', 'technology'
] as const;

type FetchType = 'latest' | 'category';
type NewsCategory = typeof NEWS_CATEGORIES[number];

// ---- Main Component ----
const MediaStackFetcher: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ApiStatus>({ isActive: false });
  const [result, setResult] = useState<FetchResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('general');

  // ---- Effects ----
  useEffect(() => {
    checkApiStatus();
  }, []);

  // ---- API Methods ----
  const checkApiStatus = async (): Promise<void> => {
    try {
      const [statusData, usageStats] = await Promise.all([
        apiClient.get<MediaStackStatusResponse>('/mediastack/status'),
        apiClient.get<MediaStackUsageStatsResponse>('/mediastack/usage-stats')
      ]);

      setStatus({
        isActive: statusData.active,
        remainingRequests: usageStats.remaining_requests,
        usageStats
      });
    } catch (error) {
      console.error('Failed to check API status:', error);
      setStatus({ isActive: false });
    }
  };

  const testConnection = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await apiClient.post<MediaStackTestConnectionResponse>('/mediastack/test-connection');
      setResult({
        success: true,
        message: res.message || 'Connection test successful'
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Connection test failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async (type: FetchType): Promise<void> => {
    setLoading(true);
    setResult(null);

    try {
      const endpoint = type === 'latest' 
        ? '/mediastack/fetch-latest' 
        : `/mediastack/fetch-category/${selectedCategory}`;

      const response = await apiClient.post<MediaStackFetchResponse>(endpoint, {});

      setResult({
        success: true,
        message: response.message,
        articlesFetched: response.articles_fetched,
        articlesSaved: response.articles_saved,
        data: response.data
      });

      await checkApiStatus();
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Failed to fetch news'
      });
    } finally {
      setLoading(false);
    }
  };

  const syncToArticles = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiClient.post<SyncArticlesResponse>('/admin/articles/sync-mediastack');
      setResult({
        success: true,
        message: response.message,
        data: response.data
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Failed to sync articles'
      });
    } finally {
      setLoading(false);
    }
  };

  // ---- Render Methods ----
  const renderApiStatus = (): JSX.Element => (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">API Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-3 rounded-lg ${status.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-medium">Status</p>
          <p className="text-lg">{status.isActive ? 'Active' : 'Inactive'}</p>
        </div>
        <div className="p-3 bg-blue-100 text-blue-800 rounded-lg">
          <p className="font-medium">Remaining Requests</p>
          <p className="text-lg">{status.remainingRequests ?? 'N/A'}</p>
        </div>
        <button
          onClick={checkApiStatus}
          className="p-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <p className="font-medium">Refresh Status</p>
          <p className="text-sm">Click to update</p>
        </button>
      </div>
    </div>
  );

  const renderConnectionTest = (): JSX.Element => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Testing...' : 'Test MediaStack Connection'}
      </button>
    </div>
  );

  const renderFetchNews = (): JSX.Element => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Fetch News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Latest News</h3>
          <p className="text-gray-600 text-sm mb-4">Fetch the latest news across all categories</p>
          <button
            onClick={() => fetchNews('latest')}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Fetching...' : 'Fetch Latest News'}
          </button>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-3">News by Category</h3>
          <div className="space-y-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as NewsCategory)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {NEWS_CATEGORIES.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchNews('category')}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Fetching...' : `Fetch ${selectedCategory} News`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentManagement = (): JSX.Element => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Content Management</h2>
      <button
        onClick={syncToArticles}
        disabled={loading}
        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Syncing...' : 'Sync to Public Articles'}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        This will make fetched articles available to readers through public endpoints
      </p>
    </div>
  );

  const renderResult = (): JSX.Element | null => {
    if (!result) return null;

    return (
      <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <h3 className="font-semibold mb-2">
          {result.success ? '✅ Success' : '❌ Error'}
        </h3>
        <p className="mb-2">{result.message}</p>
        {result.articlesFetched !== undefined && (
          <p>Articles Fetched: {result.articlesFetched}</p>
        )}
        {result.articlesSaved !== undefined && (
          <p>Articles Saved: {result.articlesSaved}</p>
        )}
        {Boolean(result.data) && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Show Details</summary>
            <pre className="text-xs mt-2 p-2 bg-white rounded overflow-auto">
              {JSON.stringify(result.data as any, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">MediaStack News Fetcher</h1>
        <p className="text-gray-600">Fetch latest news from MediaStack API and manage your content</p>
      </div>

      {renderApiStatus()}
      {renderConnectionTest()}
      {renderFetchNews()}
      {renderContentManagement()}
      {renderResult()}
    </div>
  );
};

export default MediaStackFetcher;