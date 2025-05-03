import axios from 'axios';

// Fetch market index data
export const fetchMarketIndexDataApi = async (symbols: string[]) => {
  const queryParams = symbols.map((name) => `symbols=${encodeURIComponent(name)}`).join('&');
  return axios.get(`/api/market-index-data/fetch?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};