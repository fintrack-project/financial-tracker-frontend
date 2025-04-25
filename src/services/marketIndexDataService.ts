import axios from 'axios';

export const fetchMarketIndexData = async (symbols: string[]): Promise<{ [key: string]: any }> => {
  try {
    const queryParams = symbols.map((name) => `symbols=${encodeURIComponent(name)}`).join('&');
    const response = await axios.get(`/api/market-index-data/fetch?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching market index data:', error);
    throw error;
  }
};