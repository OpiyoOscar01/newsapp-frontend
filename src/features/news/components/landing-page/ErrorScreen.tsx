import React, { useState } from 'react';

interface ErrorDetails {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
  method?: string;
  responseBody?: unknown;
  errorType: "network" | "timeout" | "http" | "unknown";
  raw: string;
}

interface ErrorScreenProps {
  error: ErrorDetails;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  const [showRaw, setShowRaw] = useState(false);

  const typeLabel: Record<ErrorDetails["errorType"], string> = {
    network: "Network Error — the server could not be reached",
    timeout: "Request Timed Out",
    http: `HTTP ${error.status ?? ""} ${error.statusText ?? ""}`,
    unknown: "Unknown Error",
  };

  const typeColor: Record<ErrorDetails["errorType"], string> = {
    network: "bg-orange-100 text-orange-700",
    timeout: "bg-yellow-100 text-yellow-700",
    http: "bg-red-100 text-red-700",
    unknown: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <svg
          className="mx-auto h-14 w-14 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-2xl font-bold text-gray-900">
          Failed to Load Content
        </h3>
      </div>

      <div className="flex justify-center mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${typeColor[error.errorType]}`}
        >
          {typeLabel[error.errorType]}
        </span>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-red-800">{error.message}</p>
      </div>

      {(error.url || error.method) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-xs font-mono text-gray-600">
          {error.method && (
            <span className="font-bold text-gray-800 mr-2">{error.method}</span>
          )}
          {error.url && <span>{error.url}</span>}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowRaw((s) => !s)}
          className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors cursor-pointer"
        >
          {showRaw ? "Hide" : "Show"} raw error details
        </button>
        {showRaw && (
          <pre className="mt-2 p-4 bg-gray-900 text-green-400 text-xs rounded-lg overflow-x-auto whitespace-pre-wrap max-h-64">
            {error.raw}
          </pre>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;