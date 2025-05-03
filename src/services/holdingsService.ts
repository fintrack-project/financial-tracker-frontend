import { fetchHoldingsApi } from '../api/holdingsApi';
import { Holding } from '../types/Holding';

export const fetchHoldings = async (accountId: string): Promise<Holding[]> => {
  try {
    const response = await fetchHoldingsApi(accountId);

    return response.data;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};