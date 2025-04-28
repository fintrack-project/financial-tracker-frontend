import axios from 'axios';

export const fetchCurrenciesByAccountId = async (accountId: string) => {
  try {
    const response = await axios.get(`/api/accounts/${accountId}/currencies`);
    return response.data; // Return the list of currencies
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};