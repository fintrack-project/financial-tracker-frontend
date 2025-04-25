import axios from 'axios';

export const fetchForexData = async (accountId: string, symbols: string[]): Promise<any[]> => {
  try {
    // Encode accountId and symbols for the query parameters
    const encodedAccountId = encodeURIComponent(accountId);
    const encodedSymbols = symbols.map((symbol) => `symbols=${encodeURIComponent(symbol)}`).join('&');

    // Construct the query string
    const queryParams = `accountId=${encodedAccountId}&${encodedSymbols}`;

    // Make the API request
    const response = await axios.get(`/api/forex-data/fetch?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forex data:', error);
    throw error;
  }
};