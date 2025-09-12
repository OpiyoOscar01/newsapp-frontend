/**
 * Registration form component
 * Purpose: Handle user registration UI and interaction
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BsEnvelope, BsLock, BsPerson, BsGithub, BsGoogle } from 'react-icons/bs';
import { useAuth, useGuestOnly } from '../hooks/useAuth';
import { FormInput } from '../components/widgets/FormInput';
import { LoadingButton } from '../components/widgets/LoadingButton';
import { validateRegisterForm } from '../utils/validation';
import type { RegisterRequest, ValidationErrors } from '../types/auth';

const Register: React.FC = () => {
  const { register, isLoading, clearAuthError } = useAuth();
  const { isAuthenticated } = useGuestOnly();

  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear global auth error
    clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any existing errors
    setErrors({});

    // Attempt registration
    await register(formData);
  };

  // Don't render if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Create Account - Custospace</title>
        <meta name="description" content="Create a new Definepressaccount" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">
              Join DefinePress today
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              error={errors.name}
              required
              disabled={isLoading}
              icon={<BsPerson />}
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              error={errors.email}
              required
              disabled={isLoading}
              icon={<BsEnvelope />}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              disabled={isLoading}
              icon={<BsLock />}
            />

            <FormInput
              label="Confirm Password"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              error={errors.password_confirmation}
              required
              disabled={isLoading}
              icon={<BsLock />}
            />

            <div className="mb-6">
              <LoadingButton
                type="submit"
                loading={isLoading}
                className="w-full"
                size="md"
              >
                Create Account
              </LoadingButton>
            </div>

            <div className="text-xs text-gray-600 text-center mb-4">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsGoogle className="text-red-500 text-lg" />
              <span className="text-sm font-medium">Sign up with Google</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsGithub className="text-gray-700 text-lg" />
              <span className="text-sm font-medium">Sign up with GitHub</span>
            </button>
          </div>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
