import { fetchPortfolioDataApi } from '../api/portfolioApi';
import { PortfolioData } from '../shared/types/PortfolioData';

export const fetchPortfolioData = async (accountId: string, baseCurrency: string): Promise<PortfolioData[]> => {
  try {
    const response = await fetchPortfolioDataApi(accountId, baseCurrency);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch portfolio data');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
};