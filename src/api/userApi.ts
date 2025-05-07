import { apiClient } from '../utils/apiClient';

interface UserDetails {
  accountId: string;
  email: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  twoFactorEnabled: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Fetch user details
export const fetchUserDetailsApi = async (accountId: string): Promise<ApiResponse<UserDetails>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserDetails>>('/api/user/fetch', { accountId });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Update user's phone number
export const updateUserPhoneApi = async (accountId: string, phone: string, countryCode: string): Promise<ApiResponse<UserDetails>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserDetails>>('/api/user/update-phone', {
      accountId,
      phone,
      countryCode,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating phone:', error);
    throw error;
  }
};

// Update user's address
export const updateUserAddressApi = async (accountId: string, address: string): Promise<ApiResponse<UserDetails>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserDetails>>('/api/user/update-address', {
      accountId,
      address,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Update user's email
export const updateUserEmailApi = async (accountId: string, email: string): Promise<ApiResponse<UserDetails>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserDetails>>('/api/user/update-email', {
      accountId,
      email,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

// Update user's password
export const updatePassword = async (accountId: string, newPassword: string): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>('/api/user/update-password', { 
      accountId, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Update user's 2FA status
export const updateTwoFactorStatusApi = async (accountId: string, enabled: boolean): Promise<ApiResponse<UserDetails>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserDetails>>('/api/user/update-2fa', {
      accountId,
      enabled,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating 2FA status:', error);
    throw error;
  }
};