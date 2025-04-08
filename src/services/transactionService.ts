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
export const uploadTransactions = async (
  accountId: string,
  transactions: Transaction[]
): Promise<void> => {
  try {
    const response = await fetch(`/api/accounts/${accountId}/upload-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactions),
    });

    if (!response.ok) {
      throw new Error('Failed to upload transactions');
    }
  } catch (error) {
    console.error('Error uploading transactions:', error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};