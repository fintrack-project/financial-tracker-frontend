import {
  fetchOverviewTransactionsApi,
  fetchPreviewTransactionsApi,
  uploadPreviewTransactionsApi,
  confirmTransactionsApi,
} from '../api/transactionApi';
import { PreviewTransaction } from '../types/PreviewTransaction';
import { OverviewTransaction } from '../types/OverviewTransaction';
import { Transaction } from '../types/Transaction';

export const fetchOverviewTransactions = async (accountId: string): Promise<OverviewTransaction[]> => {
  try {
    const response = await fetchOverviewTransactionsApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch overview transactions');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching overview transactions:', error);
    throw error;
  }
};

export const uploadPreviewTransactions = async (
  accountId: string,
  transactions: Transaction[]
): Promise<Transaction[]> => {
  try {
    const response = await uploadPreviewTransactionsApi(accountId, transactions);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upload transactions');
    }
    return response.data;
  } catch (error) {
    console.error('Error uploading transactions:', error);
    throw error;
  }
};

export const fetchPreviewTransactions = async (
  accountId: string
): Promise<Transaction[]> => {
  try {
    const response = await fetchPreviewTransactionsApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch preview transactions');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching preview transactions:', error);
    throw error;
  }
};

export const confirmTransactions = async (
  accountId: string,
  previewTransactions: PreviewTransaction[]
): Promise<void> => {
  try {
    const response = await confirmTransactionsApi(accountId, previewTransactions);
    if (!response.success) {
      throw new Error(response.message || 'Failed to confirm transactions');
    }
    console.log('Transactions confirmed successfully.');
  } catch (error) {
    console.error('Error confirming transactions:', error);
    throw error;
  }
};