import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';

interface TwoFactorSetupData {
  secret: string;
  qrCode: string;
}

export const setup2FA = async (accountId: string): Promise<ApiResponse<TwoFactorSetupData>> => {
  try {
    const response = await apiClient.post<ApiResponse<TwoFactorSetupData>>('/api/user/2fa/setup', { accountId });
    return response.data;
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    throw error;
  }
};

export const verify2FA = async (accountId: string, otp: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.post<ApiResponse<boolean>>('/api/user/2fa/verify', { accountId, otp });
    return response.data;
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    throw error;
  }
};