import { apiClient } from '../utils/apiClient';
import { Holding } from '../types/Holding';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch holdings for a specific account
export const fetchHoldingsApi = async (accountId: string): Promise<ApiResponse<Holding[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Holding[]>>(`/api/accounts/${accountId}/holdings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error;
  }
};