import { apiClient } from '../shared/utils/apiClient';
import { ApiResponse } from '../shared/types/ApiTypes';

interface Currency {
  name: string;
  currency: string;
  default: boolean;
}

// Fetch available currencies by account ID
export const fetchCurrenciesByAccountIdApi = async (accountId: string): Promise<ApiResponse<Currency[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Currency[]>>('/api/currencies/fetch', {
      params: { accountId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

// Update the base currency for the account
export const updateBaseCurrencyApi = async (accountId: string, baseCurrency: string): Promise<ApiResponse<void>> => {
  try {
    const payload = {
      accountId,
      baseCurrency,
    };
    const response = await apiClient.post<ApiResponse<void>>('/api/currencies/set-base-currency', payload);
    return response.data;
  } catch (error) {
    console.error('Error updating base currency:', error);
    throw error;
  }
};