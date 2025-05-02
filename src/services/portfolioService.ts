import axios from 'axios';
import { PortfolioData } from '../types/PortfolioData';

export const fetchPortfolioData = async (accountId: string, baseCurrency: string): Promise<PortfolioData[]> => {
  try {
    const response = await axios.post('/api/portfolio/portfolio-data', {
      accountId,
      baseCurrency,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw new Error('Failed to fetch portfolio data');
  }
};