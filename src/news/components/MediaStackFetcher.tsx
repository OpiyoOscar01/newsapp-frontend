// src/components/Admin/MediaStackFetcher.tsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useMediaStackStatus,
  useTestMediaStackConnection,
  useFetchLatestNews,
  useFetchNewsByCategory,
  useSyncMediaStackArticles,
  useIsAdmin,
} from '../api/media-stack/MediaStackQueries';
import { selectIsAuthenticated } from '../../features/authentication/store/slices/authSlice';
import type { FetchResult, MediaStackCategory, FetchType } from '../api/media-stack/MediaStackTypes';
import { NEWS_CATEGORIES, formatMediaStackError } from '../api/media-stack/MediaStackTypes';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Wifi, 
  Globe, 
  FolderOpen, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

const MediaStackFetcher: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useIsAdmin();

  const [result, setResult] = useState<FetchResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MediaStackCategory>('general');

  const { 
    isLoading: statusLoading, 
  } = useMediaStackStatus();

  const testConnectionMutation = useTestMediaStackConnection();
  const fetchLatestMutation = useFetchLatestNews();
  const fetchCategoryMutation = useFetchNewsByCategory();
  const syncArticlesMutation = useSyncMediaStackArticles();

  const isLoading = 
    testConnectionMutation.isPending ||
    fetchLatestMutation.isPending ||
    fetchCategoryMutation.isPending ||
    syncArticlesMutation.isPending ||
    statusLoading;

  useEffect(() => {
    if (!isLoading && result?.success) {
      const timer = setTimeout(() => {
        setResult(prev => prev?.success ? null : prev);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, result]);

  const handleTestConnection = async () => {
    setResult(null);
    try {
      const response = await testConnectionMutation.mutateAsync();
      setResult({
        success: true,
        message: response.message || 'Connection test successful',
      });
    } catch (error) {
      setResult({
        success: false,
        message: formatMediaStackError(error, 'Connection test failed'),
      });
    }
  };

  const handleFetchNews = async (type: FetchType) => {
    if (!isAuthenticated || !isAdmin) {
      setResult({
        success: false,
        message: 'Authentication and admin privileges required to fetch news. Please log in as admin.',
      });
      return;
    }

    setResult(null);

    try {
      let response;
      if (type === 'latest') {
        response = await fetchLatestMutation.mutateAsync();
      } else {
        response = await fetchCategoryMutation.mutateAsync({ category: selectedCategory });
      }

      setResult({
        success: true,
        message: response.message,
        articlesFetched: response.articles_fetched,
        articlesSaved: response.articles_saved,
        data: response.data || null,
      });
    } catch (error) {
      setResult({
        success: false,
        message: formatMediaStackError(error, 'Failed to fetch news'),
      });
    }
  };

  const handleSyncArticles = async () => {
    if (!isAuthenticated || !isAdmin) {
      setResult({
        success: false,
        message: 'Authentication and admin privileges required to sync articles. Please log in as admin.',
      });
      return;
    }

    setResult(null);

    try {
      const response = await syncArticlesMutation.mutateAsync();
      setResult({
        success: true,
        message: response.message,
        data: response.data || null,
      });
    } catch (error) {
      setResult({
        success: false,
        message: formatMediaStackError(error, 'Failed to sync articles'),
      });
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MediaStack News Fetcher</h1>
          <p className="text-gray-600">Fetch latest news from MediaStack API and manage your content</p>
        </div>
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {!isAuthenticated ? 'Authentication Required' : 'Admin Privileges Required'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{!isAuthenticated ? 'You need to be logged in to access MediaStack features.' : 'Admin privileges are required to access MediaStack features.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MediaStack News Fetcher</h1>
            <p className="text-gray-600">Fetch latest news from MediaStack API and manage your content</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full cursor-default">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Access</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Connection Test
        </h2>
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
        >
          {testConnectionMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Wifi className="h-5 w-5" />
              Test MediaStack Connection
            </>
          )}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Fetch News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Latest News</h3>
            <p className="text-gray-600 text-sm mb-4">Fetch the latest news across all categories</p>
            <button
              onClick={() => handleFetchNews('latest')}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {fetchLatestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Fetch Latest News
                </>
              )}
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              News by Category
            </h3>
            <div className="space-y-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MediaStackCategory)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                {NEWS_CATEGORIES.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleFetchNews('category')}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {fetchCategoryMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <FolderOpen className="h-4 w-4" />
                    Fetch {selectedCategory} News
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Content Management
        </h2>
        <button
          onClick={handleSyncArticles}
          disabled={isLoading}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
        >
          {syncArticlesMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              Sync to Public Articles
            </>
          )}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          This will make fetched articles available to readers through public endpoints
        </p>
      </div>

      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} cursor-pointer`}>
          <div className="flex items-center gap-2 mb-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <h3 className="font-semibold">
              {result.success ? 'Success' : 'Error'}
            </h3>
          </div>
          <p className="mb-2">{result.message}</p>
          {result.articlesFetched !== undefined && (
            <p>Articles Fetched: {result.articlesFetched}</p>
          )}
          {result.articlesSaved !== undefined && (
            <p>Articles Saved: {result.articlesSaved}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaStackFetcher;