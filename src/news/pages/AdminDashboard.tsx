// src/pages/AdminDashboard.tsx - Add logout functionality
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaStackFetcher from '../components/MediaStackFetcher';
import { apiClient } from '../services/api/client';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await apiClient.get('/user');
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.removeToken();
      setIsAuthenticated(false);
      navigate('/admin/login');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/admin/login');
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be authenticated to access the admin dashboard.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || user?.email || 'Admin'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>
              <nav className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-blue-100 text-blue-700 rounded-md font-medium">
                  News Fetcher
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  Article Management
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  Analytics
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <MediaStackFetcher />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;