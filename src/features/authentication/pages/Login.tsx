/**
 * Login form component
 * Purpose: Handle user login UI and interaction
 */
import React, { useState } from "react";
import { Helmet} from "react-helmet-async"; // ✅ correct import
import { Link } from "react-router-dom";
import { BsEnvelope, BsLock, BsGithub, BsGoogle } from "react-icons/bs";
import { useAuth, useGuestOnly } from "../hooks/useAuth";
import { FormInput } from "../components/widgets/FormInput";
import { LoadingButton } from "../components/widgets/LoadingButton";
import { validateLoginForm } from "../utils/validation";
import type { LoginRequest, ValidationErrors } from "../types/auth";

const Login: React.FC = () => {
  const { login, isLoading, clearAuthError } = useAuth();
  const { isAuthenticated } = useGuestOnly();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear global auth error
    clearAuthError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any existing errors
    setErrors({});

    // Attempt login
    await login(formData);
  };

  // Don't render if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Login - Custospace</title>
        <meta
          name="description"
          content="Login to your Custospace account"
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to your Custospace account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
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

            <div className="mb-6">
              <LoadingButton
                type="submit"
                loading={isLoading}
                className="w-full"
                size="md"
              >
                Sign In
              </LoadingButton>
            </div>

            <div className="text-center mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500">
                Or continue with
              </span>
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
              <span className="text-sm font-medium">
                Continue with Google
              </span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsGithub className="text-gray-700 text-lg" />
              <span className="text-sm font-medium">
                Continue with GitHub
              </span>
            </button>
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      </>
  );
};

export default Login;
