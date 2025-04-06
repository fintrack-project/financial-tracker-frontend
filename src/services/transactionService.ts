interface Transaction {
  date: string;
  assetName: string;
  credit: number;
  debit: number;
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  unit: string;
}

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