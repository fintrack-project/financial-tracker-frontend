import { fetchHoldingsApi } from '../api/holdingsApi';
import { Holding } from '../types/Holding';

export const fetchHoldings = async (accountId: string): Promise<Holding[]> => {
  try {
    const response = await fetchHoldingsApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch holdings');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error;
  }
};