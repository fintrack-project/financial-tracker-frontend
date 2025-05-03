import { fetchPortfolioDataApi } from '../api/portfolioApi';
import { PortfolioData } from '../types/PortfolioData';

export const fetchPortfolioData = async (accountId: string, baseCurrency: string): Promise<PortfolioData[]> => {
  try {
    const response = await fetchPortfolioDataApi(accountId, baseCurrency);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw new Error('Failed to fetch portfolio data');
  }
};