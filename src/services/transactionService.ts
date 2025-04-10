import { PreviewTransaction } from 'types/PreviewTransaction';
import { Transaction } from '../types/Transaction';

/**
 * Fetch transactions from the backend for a specific account.
 * @param accountId - The ID of the account to fetch transactions for.
 * @returns A promise that resolves to an array of transactions.
 */
export const fetchTransactions = async (accountId: string): Promise<Transaction[]> => {
  try {
    const response = await fetch(`/api/accounts/${accountId}/transactions`, {
      credentials: 'include', // Include cookies for session-based authentication
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Upload transactions to the backend for a specific account.
 * @param accountId - The ID of the account to upload transactions for.
 * @param transactions - The list of transactions to upload.
 * @returns A promise that resolves when the upload is successful.
 */
export const uploadPreviewTransactions = async (
  accountId: string,
  transactions: Transaction[]
) : Promise <Transaction[]> => {
  try {
    const response = await fetch(`/api/accounts/${accountId}/upload-preview-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactions),
    });

    if (!response.ok) {
      throw new Error('Failed to upload transactions');
    }

    return response.json();

  } catch (error) {
    console.error('Error uploading transactions:', error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};

export const fetchPreviewTransactions = async (
  accountId: string
): Promise<Transaction[]> => {
  const response = await fetch(`/api/accounts/${accountId}/preview-transactions`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch preview transactions');
  }

  return response.json();
};

export const confirmTransactions = async (
  accountId: string,
  previewTransactions: PreviewTransaction[]
): Promise<void> => {
  try {
    const response = await fetch(`/api/accounts/${accountId}/confirm-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(previewTransactions), // Send all previewTransactions
    });

    if (!response.ok) {
      throw new Error('Failed to confirm transactions');
    }

    // No need to return anything since the backend responds with no content (204 No Content or 200 OK)
  } catch (error) {
    console.error('Error confirming transactions:', error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};