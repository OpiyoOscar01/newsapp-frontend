// src/pages/UserLogin.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, ArrowLeft, AlertCircle, Lock, Mail, ChevronRight, Eye, EyeOff } from 'lucide-react';
import type { LoginValidationErrors } from '../api/auth/AuthTypes';
import { useLogin } from '../api/auth/AuthQueries';
import { ROUTES } from '../routes/routes';
import { ToastContainer } from '../components/Notifications/Toast';
import { useToast } from '../../features/news/hooks/useToast';

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, success, removeToast } = useToast();
  
  // Get the redirect path from location state, or default to home
  const from = (location.state as any)?.from?.pathname || ROUTES.HOME;
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<LoginValidationErrors>({});

  const { mutate: login, isPending: loading } = useLogin({
    onSuccess: (data) => {
      console.log('Login successful:', data);
      success('Login successful! Welcome back.');
      
      if (data.data.user.is_admin) {
        // Admin users always go to admin dashboard
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        // Normal users go back to their previous page or home
        navigate(from, { replace: true });
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors as LoginValidationErrors);
      }
      
      if (error.response?.data?.message && !error.response?.data?.errors) {
        setValidationErrors({
          email: [error.response.data.message]
        });
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name as keyof LoginValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof LoginValidationErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    login({
      email: formData.email,
      password: formData.password
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getFieldError = (fieldName: keyof LoginValidationErrors): string => {
    return validationErrors[fieldName]?.join(', ') || '';
  };

  const hasGeneralError = (): boolean => {
    return Object.keys(validationErrors).length > 0 && 
           !validationErrors.email && 
           !validationErrors.password;
  };

  const getGeneralError = (): string => {
    if (validationErrors.email && validationErrors.email[0] && 
        !validationErrors.email[0].toLowerCase().includes('email')) {
      return validationErrors.email[0];
    }
    return '';
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 cursor-pointer">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your DefinePress account
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {hasGeneralError() && getGeneralError() && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm cursor-pointer">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{getGeneralError()}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 cursor-pointer">
                  Email address *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                      getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-text`}
                    placeholder="john.doe@example.com"
                  />
                  {getFieldError('email') && (
                    <p className="mt-1 text-xs text-red-600">{getFieldError('email')}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 cursor-pointer">
                  Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                      getFieldError('password') ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-text`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                  {getFieldError('password') && (
                    <p className="mt-1 text-xs text-red-600">{getFieldError('password')}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to DefinePress?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={ROUTES.REGISTER}
                  state={{ from: location.state?.from }}
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  Create new account
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to={ROUTES.HOME}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to main site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default UserLogin;