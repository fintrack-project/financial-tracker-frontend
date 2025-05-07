import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';

interface Account {
  accountId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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