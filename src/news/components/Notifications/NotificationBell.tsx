import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Mock notifications data
  useEffect(() => {
    if (isAuthenticated) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'info',
          title: 'New Feature Available',
          message: 'Bookmark articles is now available. Save your favorite reads!',
          time: '2 hours ago',
          read: false,
          action: {
            label: 'Try it',
            onClick: () => console.log('Navigate to bookmarks')
          }
        },
        {
          id: '2',
          type: 'success',
          title: 'Article Published',
          message: 'Your article "Tech Trends 2024" has been published successfully.',
          time: '1 day ago',
          read: true
        },
        {
          id: '3',
          type: 'warning',
          title: 'Trending Topic',
          message: 'Artificial Intelligence is trending in your followed categories.',
          time: '2 days ago',
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [isAuthenticated]);

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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 group"
        aria-label="Notifications"
      >
        <svg 
          className="w-6 h-6 transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.17 5.97 5.97 0 01-3.79-1.17 6 6 0 118.58 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a6 6 0 00-6 6c0 1.887.657 3.617 1.75 4.98l.25.3A6 6 0 0012 18a6 6 0 004-1.72l.25-.3A6 6 0 0018 8a6 6 0 00-6-6z" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.17 5.97 5.97 0 01-3.79-1.17 6 6 0 118.58 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">No notifications yet</p>
                <p className="text-sm text-gray-500 mt-1">We'll notify you when something arrives</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-all duration-200 ${
                      notification.read ? 'bg-white' : 'bg-blue-50/50'
                    } hover:bg-gray-50`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className={`text-sm font-semibold ${
                            notification.read ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action?.onClick();
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50 bg-gray-50">
            <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;