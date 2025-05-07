import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';

export const verifyEmailApi = async (token: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/email/verify', { token });
    return response.data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

export const checkEmailVerifiedApi = async (accountId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/email/verified', { accountId });
    return response.data;
  } catch (error) {
    console.error('Email verification check error:', error);
    throw error;
  }
};

export const sendEmailVerificationApi = async (accountId: string, email: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/email/send-verification', { accountId, email });
    return response.data;
  } catch (error) {
    console.error('Email verification send error:', error);
    throw error;
  }
};