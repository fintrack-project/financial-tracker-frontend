import {
  fetchPortfolioPieChartDataApi,
  fetchPortfolioCombinedBarChartDataApi,
} from '../api/portfolioChartApi';
import { ChartData } from '../types/ChartData';
import { CombinedChartData } from '../types/CombinedChartData';

export const fetchPortfolioPieChartData = async (
  accountId: string,
  category: string,
  baseCurrency: string
): Promise<ChartData[]> => {
  try {
    const response = await fetchPortfolioPieChartDataApi(accountId, category, baseCurrency);
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
    
    // Parse the backend response
    const rawData = response.data; // Backend response
    console.log('Raw data from backend:', rawData); // Debug log

    // Validate that rawData is an array
    if (!Array.isArray(rawData)) {
      throw new Error('Invalid backend response format: rawData is not an array');
    }

    // Transform the raw data into the expected format
    const parsedData: CombinedChartData[] = rawData.map((entry) => {
      // Validate that each entry has a date and data array
      if (typeof entry.date !== 'string' || !Array.isArray(entry.data)) {
        throw new Error(`Invalid entry format: ${JSON.stringify(entry)}`);
      }

      return {
        date: entry.date,
        assets: entry.data.map((asset : ChartData) => ({
          assetName: asset.assetName,
          symbol: asset.symbol,
          subcategory: asset.subcategory,
          value: asset.value,
          color: asset.color,
          priority: asset.priority,
          totalValue: asset.totalValue,
          subcategoryValue: asset.subcategoryValue,
          percentage: asset.percentage,
          percentageOfSubcategory: asset.percentageOfSubcategory,
        })),
      };
    });

    return parsedData;
  } catch (error) {
    console.error('Error fetching portfolio bar chart data:', error);
    throw new Error('Failed to fetch portfolio bar chart data');
  }
};