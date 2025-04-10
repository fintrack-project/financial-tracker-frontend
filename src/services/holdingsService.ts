import { Holding } from '../types/Holding';

/**
 * Fetch holdings from the backend for a specific account.
 * @param accountId - The ID of the account to fetch holdings for.
 * @returns A promise that resolves to an array of holdings.
 */
export const fetchHoldings = async (accountId: string): Promise<Holding[]> => {
  try {
    const response = await fetch(`/api/accounts/${accountId}/holdings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch holdings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};