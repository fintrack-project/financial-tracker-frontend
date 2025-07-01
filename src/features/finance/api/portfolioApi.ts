import { apiClient } from '../../../shared/utils/apiClient';
import { PortfolioData } from '../types/PortfolioData';
import { ApiResponse } from '../../../shared/types/ApiTypes';

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