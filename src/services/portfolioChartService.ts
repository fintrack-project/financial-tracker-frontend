import {
  fetchPortfolioPieChartDataApi,
  fetchPortfolioCombinedBarChartDataApi,
} from '../api/portfolioChartApi';
import { ChartData, RawChartDataEntry } from '../shared/types/ChartData';
import { CombinedChartData } from '../shared/types/CombinedChartData';

export const fetchPortfolioPieChartData = async (
  accountId: string,
  category: string,
  baseCurrency: string
): Promise<ChartData[]> => {
  try {
    const response = await fetchPortfolioPieChartDataApi(accountId, category, baseCurrency);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch portfolio pie chart data');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio pie chart data:', error);
    throw new Error('Failed to fetch portfolio pie chart data');
  }
};

export const fetchPortfolioCombinedBarChartData = async (
  accountId: string,
  category: string,
  baseCurrency: string
): Promise<CombinedChartData[]> => {
  if (!accountId) {
    console.warn('Account ID is null, skipping fetch'); // Debug log
    return [];
  }

  try {
    const response = await fetchPortfolioCombinedBarChartDataApi(accountId, category, baseCurrency);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch portfolio bar chart data');
    }

    // Parse the backend response
    const rawData = response.data; // Backend response
    console.log('Raw data from backend:', rawData); // Debug log

    // Validate that rawData is an array
    if (!Array.isArray(rawData)) {
      throw new Error('Invalid backend response format: rawData is not an array');
    }

    // Transform the raw data into the expected format
    const parsedData: CombinedChartData[] = rawData.map((entry: RawChartDataEntry) => {
      return {
        date: entry.date,
        assets: entry.data,
      };
    });

    return parsedData;
  } catch (error) {
    console.error('Error fetching portfolio bar chart data:', error);
    throw new Error('Failed to fetch portfolio bar chart data');
  }
};