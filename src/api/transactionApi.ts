import axios from 'axios';
import { Transaction } from '../types/Transaction';
import { PreviewTransaction } from '../types/PreviewTransaction';

// Fetch overview transactions
export const fetchOverviewTransactionsApi = async (accountId: string) => {
  return axios.get(`/api/accounts/${accountId}/overview-transactions`, {
    withCredentials: true, // Include cookies for session-based authentication
  });
};

// Upload preview transactions
export const uploadPreviewTransactionsApi = async (accountId: string, transactions: Transaction[]) => {
  return axios.post(`/api/accounts/${accountId}/upload-preview-transactions`, transactions, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Fetch preview transactions
export const fetchPreviewTransactionsApi = async (accountId: string) => {
  return axios.get(`/api/accounts/${accountId}/preview-transactions`);
};

// Confirm transactions
export const confirmTransactionsApi = async (accountId: string, previewTransactions: PreviewTransaction[]) => {
  return axios.post(`/api/accounts/${accountId}/confirm-transactions`, previewTransactions, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};