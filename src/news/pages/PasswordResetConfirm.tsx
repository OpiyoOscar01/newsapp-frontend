// src/pages/PasswordResetConfirm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { ToastContainer } from '../components/Notifications/Toast';
import { useToast } from '../../features/news/hooks/useToast';
import { ROUTES } from '../routes/routes';

interface ResetConfirmValidationErrors {
  password?: string[];
  password_confirmation?: string[];
  token?: string[];
  general?: string[];
}


const PasswordResetConfirm: React.FC = () => {
  const navigate = useNavigate();
const { token } = useParams<{ token: string }>();
  const { toasts, success, error, removeToast } = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ResetConfirmValidationErrors>({});
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidationErrors({ token: ['Invalid reset link'] });
        setIsTokenValid(false);
        return;
      }
      
      // TODO: Integrate with backend API to validate token
      try {
        // const response = await validateResetToken(token);
        
        // Simulate token validation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, consider token valid if it exists and has minimum length
        if (token.length > 10) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setValidationErrors({ token: ['Invalid or expired reset link'] });
          error('This password reset link is invalid or has expired.');
        }
        
      } catch (err: any) {
        console.error('Token validation error:', err);
        setIsTokenValid(false);
        setValidationErrors({ token: ['Invalid or expired reset link'] });
        error('This password reset link is invalid or has expired.');
      }
    };
    
    validateToken();
  }, [token]);

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let message = '';
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (password.length === 0) {
      message = '';
    } else if (score <= 2) {
      message = 'Weak password';
    } else if (score <= 4) {
      message = 'Moderate password';
    } else {
      message = 'Strong password';
    }
    
    setPasswordStrength({ score, message });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Clear validation errors for the field being edited
    if (validationErrors[name as keyof ResetConfirmValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ResetConfirmValidationErrors];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: ResetConfirmValidationErrors = {};
    
    if (!formData.password) {
      errors.password = ['Password is required'];
    } else if (formData.password.length < 8) {
      errors.password = ['Password must be at least 8 characters'];
    }
    
    if (!formData.password_confirmation) {
      errors.password_confirmation = ['Please confirm your password'];
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = ['Passwords do not match'];
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Please fix the validation errors');
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors({});
    
    // TODO: Integrate with backend API
    try {
      // const response = await passwordResetConfirm({
      //   token: token,
      //   password: formData.password,
      //   password_confirmation: formData.password_confirmation
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      success('Password reset successful! You can now login with your new password.');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        error(err.response.data.message);
        setValidationErrors({ general: [err.response.data.message] });
      } else {
        error('Failed to reset password. Please try again.');
        setValidationErrors({ general: ['Failed to reset password. Please try again.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getFieldError = (fieldName: keyof ResetConfirmValidationErrors): string => {
    return validationErrors[fieldName]?.join(', ') || '';
  };

  // Loading state
  if (isTokenValid === null) {
    return (
      <>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 text-center">
              <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h2 className="text-xl font-medium text-gray-900">Validating reset link...</h2>
              <p className="mt-2 text-sm text-gray-600">Please wait while we verify your request</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Invalid token state
  if (isTokenValid === false) {
    return (
      <>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 text-center">
              <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">
                {validationErrors.token?.[0] || 'This password reset link is invalid or has expired.'}
              </p>
              <div className="space-y-3">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  Request New Reset Link
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Valid token - show reset form
  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Create new password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your new password below
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 cursor-pointer">
                  New Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                      getFieldError('password') ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-text`}
                    placeholder="Enter your new password"
                    disabled={isSubmitting}
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
                </div>
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score <= 2 ? 'bg-red-500' :
                            passwordStrength.score <= 4 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs ${
                        passwordStrength.score <= 2 ? 'text-red-600' :
                        passwordStrength.score <= 4 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.message}
                      </span>
                    </div>
                  </div>
                )}
                
                {getFieldError('password') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('password')}</p>
                )}
                
                <p className="mt-2 text-xs text-gray-500">
                  Password must be at least 8 characters and include a mix of letters, numbers, and symbols for better security
                </p>
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 cursor-pointer">
                  Confirm New Password *
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                      getFieldError('password_confirmation') ? 'border-red-300' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-text`}
                    placeholder="Confirm your new password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                
                {formData.password_confirmation && formData.password === formData.password_confirmation && (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Passwords match
                  </p>
                )}
                
                {getFieldError('password_confirmation') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('password_confirmation')}</p>
                )}
              </div>

              {getFieldError('general') && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{getFieldError('general')}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Resetting password...
                    </>
                  ) : (
                    'Reset Password'
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
                  <span className="px-2 bg-white text-gray-500">Remember your password?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={ROUTES.LOGIN}
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetConfirm;