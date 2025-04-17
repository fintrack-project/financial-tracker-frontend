import axios from 'axios';
import { Holding } from '../types/Holding';

export const fetchHoldings = async (accountId: string): Promise<Holding[]> => {
  try {
    const response = await axios.get(`/api/accounts/${accountId}/holdings`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};