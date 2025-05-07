import { apiClient } from '../utils/apiClient';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const verifyPassword = async (accountId: string, password: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.post<ApiResponse<boolean>>('/api/user/password/verify', { accountId, password });
    return response.data;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
};