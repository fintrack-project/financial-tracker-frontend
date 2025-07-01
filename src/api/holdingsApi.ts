import { apiClient } from '../shared/utils/apiClient';
import { Holding } from '../shared/types/Holding';
import { ApiResponse } from '../shared/types/ApiTypes';

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