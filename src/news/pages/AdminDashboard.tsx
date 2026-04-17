// src/pages/AdminDashboard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut, 
  Newspaper, 
  FileText, 
  Settings,
  TrendingUp,
  Home
} from 'lucide-react';
import MediaStackFetcher from '../components/MediaStackFetcher';
import VisitorAnalytics from '../components/Admin/VisitorAnalytics';
import { useAppSelector } from  '../../shared/hooks/useRedux';
import { selectIsAuthenticated, selectUser, selectIsLoading } from '../../features/authentication/store/slices/authSlice';
import { useLogout } from '../api/auth/AuthQueries';
import { ROUTES } from '../routes/routes';

type ActiveTab = 'news-fetcher' | 'analytics' | 'articles' | 'settings';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('analytics');

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      navigate(ROUTES.LOGIN);
    }
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { id: 'analytics' as ActiveTab, label: 'Visitor Analytics', icon: TrendingUp },
    { id: 'news-fetcher' as ActiveTab, label: 'News Fetcher', icon: Newspaper },
    { id: 'articles' as ActiveTab, label: 'Article Management', icon: FileText },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg cursor-pointer">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.first_name || user?.name || user?.email || 'Admin'}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <Home className="h-4 w-4 mr-1" />
                View Site
              </button>
              <button
                onClick={() => logout()}
                className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-3 px-3 py-2">Admin Tools</h2>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'analytics' && <VisitorAnalytics />}
            {activeTab === 'news-fetcher' && <MediaStackFetcher />}
            {activeTab === 'articles' && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4 cursor-pointer" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Management</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4 cursor-pointer" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;