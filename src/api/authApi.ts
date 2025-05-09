import { apiClient } from '../utils/apiClient';
import { LoginRequest } from '../types/Requests';
import { AuthResponse } from '../types/AuthTypes';
import { ApiResponse } from '../types/ApiTypes';
import { AxiosError } from 'axios';

export const loginApi = async (loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/user/login', loginData);
    console.log('Raw backend response:', response);
    console.log('Response data:', response.data);
    console.log('Response headers:', response.headers);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof AxiosError && error.response) {
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    throw error;
  }
};

export const registerApi = async (registerData: { userId: string; email: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/user/register', registerData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Password reset request API function
export const requestPasswordResetApi = async (identifier: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/password-reset-request', { identifier });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

// Validate password reset token API function
export const validateResetTokenApi = async (token: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.get<ApiResponse<void>>(`/api/user/validate-reset-token/${token}`);
    return response.data;
  } catch (error) {
    console.error('Token validation error:', error);
    throw error;
  }
};

// Reset password with token API function
export const resetPasswordApi = async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/reset-password', {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};