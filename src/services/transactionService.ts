import { PreviewTransaction } from 'types/PreviewTransaction';
import { OverviewTransaction } from 'types/OverviewTransaction';
import { Transaction } from '../types/Transaction';
import axios from 'axios';

// export const fetchTransactions = async (accountId: string): Promise<Transaction[]> => {
//   try {
//     const response = await axios.get(`/api/accounts/${accountId}/transactions`, {
//       withCredentials: true, // Include cookies for session-based authentication
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//     throw error;
//   }
// };

export const fetchOverviewTransactions = async (accountId: string): Promise<OverviewTransaction[]> => {
  try {
    const response = await axios.get(`/api/accounts/${accountId}/overview-transactions`, {
      withCredentials: true, // Include cookies for session-based authentication
    });
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
    const response = await axios.post(
      `/api/accounts/${accountId}/upload-preview-transactions`,
      transactions,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
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
    const response = await axios.get(`/api/accounts/${accountId}/preview-transactions`);
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
    await axios.post(
      `/api/accounts/${accountId}/confirm-transactions`,
      previewTransactions,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Transactions confirmed successfully.');
  } catch (error) {
    console.error('Error confirming transactions:', error);
    throw error;
  }
};