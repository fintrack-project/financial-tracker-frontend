import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';

export const verifyPassword = async (accountId: string, password: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.post<ApiResponse<boolean>>('/api/user/password/verify', { accountId, password });
    return response.data;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
};