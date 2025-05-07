import { apiClient } from '../utils/apiClient';
import { PortfolioData } from '../types/PortfolioData';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch portfolio data
export const fetchPortfolioDataApi = async (accountId: string, baseCurrency: string): Promise<ApiResponse<PortfolioData[]>> => {
  try {
    const response = await apiClient.post<ApiResponse<PortfolioData[]>>('/api/portfolio/portfolio-data', {
      accountId,
      baseCurrency,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
};