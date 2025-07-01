import { apiClient } from '../shared/utils/apiClient';
import { Transaction } from '../shared/types/Transaction';
import { PreviewTransaction } from '../shared/types/PreviewTransaction';
import { OverviewTransaction } from '../shared/types/OverviewTransaction';
import { ApiResponse } from '../shared/types/ApiTypes';

// Fetch overview transactions
export const fetchOverviewTransactionsApi = async (accountId: string): Promise<ApiResponse<OverviewTransaction[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<OverviewTransaction[]>>(`/api/accounts/${accountId}/overview-transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching overview transactions:', error);
    throw error;
  }
};

// Upload preview transactions
export const uploadPreviewTransactionsApi = async (accountId: string, transactions: Transaction[]): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await apiClient.post<ApiResponse<Transaction[]>>(
      `/api/accounts/${accountId}/upload-preview-transactions`,
      transactions
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading preview transactions:', error);
    throw error;
  }
};

// Fetch preview transactions
export const fetchPreviewTransactionsApi = async (accountId: string): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Transaction[]>>(`/api/accounts/${accountId}/preview-transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching preview transactions:', error);
    throw error;
  }
};

// Confirm transactions
export const confirmTransactionsApi = async (accountId: string, previewTransactions: PreviewTransaction[]): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      `/api/accounts/${accountId}/confirm-transactions`,
      previewTransactions
    );
    return response.data;
  } catch (error) {
    console.error('Error confirming transactions:', error);
    throw error;
  }
};