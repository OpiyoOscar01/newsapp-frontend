// src/components/Debug/AuthDebugger.tsx
import React, { useState } from 'react';
import { useAppSelector } from '../../shared/hooks/useRedux';
import {
  selectUser,
  selectAccessToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
} from '../../features/authentication/store/slices/authSlice';

const AuthDebugger: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${label} copied!`);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const getStoredAuthData = () => {
    try {
      const stored = localStorage.getItem('auth_data');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const storedData = getStoredAuthData();

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800 transition-all cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isAuthenticated ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
            <span className={`relative inline-flex h-3 w-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          Auth Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-3 w-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <h3 className="font-semibold text-white">Auth Debugger</h3>
          {isLoading && (
            <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto p-4 space-y-3 text-sm">
        {/* Authentication Status */}
        <div className="rounded-md bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-medium text-gray-700">Loading:</span>
            <span className="text-gray-900">{isLoading ? 'Yes' : 'No'}</span>
          </div>
          {error && (
            <div className="mt-2 rounded-md bg-red-50 p-2 text-xs text-red-700">
              Error: {error}
            </div>
          )}
        </div>

        {/* Token Information */}
        <div className="rounded-md bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">Access Token:</span>
            <button
              onClick={() => accessToken && copyToClipboard(accessToken, 'Token')}
              disabled={!accessToken}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <div className="rounded bg-gray-100 p-2 font-mono text-xs break-all">
            {accessToken ? (
              <>
                <span>{accessToken.substring(0, 30)}...</span>
                <br />
                <span className="text-gray-500">Length: {accessToken.length} chars</span>
              </>
            ) : (
              <span className="text-gray-500">No token</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Token Type:</span>
            <span className="font-mono">Bearer</span>
          </div>
        </div>

        {/* User Information */}
        <div className="rounded-md bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">User Info:</span>
            <button
              onClick={() => user && copyToClipboard(JSON.stringify(user, null, 2), 'User data')}
              disabled={!user}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer disabled:opacity-50"
            >
              Copy JSON
            </button>
          </div>
          {user ? (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="font-mono">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span>{user.first_name} {user.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-mono">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Is Admin:</span>
                <span>{user.is_admin ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(user.created_at).toLocaleString()}</span>
              </div>
              {user.roles && user.roles.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Roles:</span>
                  <span>{user.roles.join(', ')}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-2">No user data</div>
          )}
        </div>

        {/* Stored Data */}
        <div className="rounded-md bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">LocalStorage:</span>
            <button
              onClick={() => storedData && copyToClipboard(JSON.stringify(storedData, null, 2), 'Stored data')}
              disabled={!storedData}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer disabled:opacity-50"
            >
              Copy JSON
            </button>
          </div>
          {storedData ? (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Has Token:</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Token Preview:</span>
                <span className="font-mono">{storedData.access_token?.substring(0, 20)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Token Type:</span>
                <span>{storedData.token_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">User Email:</span>
                <span>{storedData.user?.email}</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-2">No stored auth data</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              console.log('=== AUTH DEBUG INFO ===');
              console.log('Redux State:', { user, accessToken, isAuthenticated, isLoading, error });
              console.log('LocalStorage:', storedData);
              console.log('=== END DEBUG ===');
            }}
            className="flex-1 rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Console Log
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reload Page
          </button>
        </div>

        {copySuccess && (
          <div className="rounded-md bg-green-100 p-2 text-center text-xs text-green-800">
            {copySuccess}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebugger;