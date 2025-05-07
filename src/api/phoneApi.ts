import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';

export const sendPhoneVerifiedApi = async (accountId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/phone/verified', { accountId });
    return response.data;
  } catch (error) {
    console.error('Phone verification error:', error);
    throw error;
  }
};