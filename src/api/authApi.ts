import { apiClient } from '../utils/apiClient';
import { LoginRequest } from '../types/Requests';
import { AuthResponse } from '../types/AuthTypes';
export const loginApi = async (loginData: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/user/login', loginData);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Let apiClient handle the error
  }
};

export const registerApi = async (registerData: { userId: string; email: string; password: string }): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/user/register', registerData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error; // Let apiClient handle the error
  }
};