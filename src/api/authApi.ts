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