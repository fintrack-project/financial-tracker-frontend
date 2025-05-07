import { apiClient } from '../utils/apiClient';

interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Fetch portfolio pie chart data
export const fetchPortfolioPieChartDataApi = async (
  accountId: string,
  category: string,
  baseCurrency: string
): Promise<ApiResponse<ChartData>> => {
  try {
    const response = await apiClient.post<ApiResponse<ChartData>>('/api/portfolio/piechart-data', {
      accountId,
      category,
      baseCurrency,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio pie chart data:', error);
    throw error;
  }
};

// Fetch portfolio combined bar chart data
export const fetchPortfolioCombinedBarChartDataApi = async (
  accountId: string,
  category: string,
  baseCurrency: string
): Promise<ApiResponse<ChartData>> => {
  try {
    const response = await apiClient.post<ApiResponse<ChartData>>('/api/portfolio/barchart-data', {
      accountId,
      category,
      baseCurrency,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio bar chart data:', error);
    throw error;
  }
};