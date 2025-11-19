// src/components/User/UserMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogin = () => {
    navigate('/auth/login');
    setIsOpen(false);
  };

  const handleRegister = () => {
    navigate('/auth/register');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLogin}
          className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={handleRegister}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          Join Free
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <span className="text-white font-semibold text-sm">
              {user?.name ? getInitials(user.name) : 'U'}
            </span>
          </div>
          {user?.role === 'admin' && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-none">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {user?.role === 'admin' ? 'Administrator' : 'Member'}
          </p>
        </div>
        
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-lg z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {user?.name ? getInitials(user.name) : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user?.role === 'admin' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role === 'admin' ? 'Administrator' : 'Member'}
                  </span>
                  {user?.email_verified_at ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">Bookmarks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-xs text-gray-500">Read</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              to="/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">My Profile</p>
                <p className="text-sm text-gray-500">View and edit profile</p>
              </div>
            </Link>

            <Link
              to="/bookmarks"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bookmarks</p>
                <p className="text-sm text-gray-500">Saved articles</p>
              </div>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Admin Dashboard</p>
                  <p className="text-sm text-gray-500">Manage content & users</p>
                </div>
              </Link>
            )}

            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Settings</p>
                <p className="text-sm text-gray-500">Preferences & privacy</p>
              </div>
            </Link>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;