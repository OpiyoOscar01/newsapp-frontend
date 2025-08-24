/**
 * Authentication service layer
 * Purpose: Encapsulate all authentication-related API calls and business logic
 */
import { apiClient } from '../../../shared/services/apiClient';
import { API_CONFIG } from '../../../config/api';
import type { 
  AuthResponse, 
  LoginRequest, 
  User 
} from '../types/auth';
import type { RegisterRequest } from '../types/auth';
import type { ApiResponse } from '../../../shared/types/api';

class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN, 
        credentials
      );
      
      console.log('Login service - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login service - Error:', error);
      throw error;
    }
  }

  /**
   * Register new user account
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER, 
        userData
      );
      
      console.log('Register service - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register service - Error:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      console.log('Logout service - Success');
    } catch (error) {
      console.error('Logout service - Error:', error);
      // Don't throw error for logout - we want to clear local state regardless
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken }
      );
      
      console.log('Token refresh - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Token refresh - Error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/user/profile');
      console.log('Get user profile - Success:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Get user profile - Error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();