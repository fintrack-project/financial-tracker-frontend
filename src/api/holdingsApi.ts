import axios from 'axios';

// Fetch holdings for a specific account
export const fetchHoldingsApi = async (accountId: string) => {
  return axios.get(`/api/accounts/${accountId}/holdings`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};