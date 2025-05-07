import { apiClient } from '../utils/apiClient';

interface Account {
  accountId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const createAccountApi = async (userId: string): Promise<ApiResponse<Account>> => {
  try {
    const response = await apiClient.post<ApiResponse<Account>>('/api/accounts/create', null, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};