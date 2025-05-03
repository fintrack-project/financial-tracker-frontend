import axios from 'axios';

// Fetch portfolio data
export const fetchPortfolioDataApi = async (accountId: string, baseCurrency: string) => {
  return axios.post('/api/portfolio/portfolio-data', {
    accountId,
    baseCurrency,
  });
};