import axios from 'axios';

export const fetchForexData = async (symbols: string[]): Promise<any[]> => {
  try {
    const response = await axios.post('/api/forex-data/fetch', { symbols });
    return response.data;
  } catch (error) {
    console.error('Error fetching forex data:', error);
    throw error;
  }
};