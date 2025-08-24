/**
 * Authentication guard component
 * Purpose: Protect routes based on authentication status
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/authentication/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  fallbackPath,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Protect authenticated routes
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate
        to={fallbackPath || '/login'}
        state={{ from: location }}
        replace
      />
    );
  }

  // Protect guest-only routes (login, register)
  if (!requireAuth && isAuthenticated) {
    const redirectTo = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
