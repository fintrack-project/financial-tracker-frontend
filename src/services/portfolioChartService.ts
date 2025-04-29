import axios from 'axios';

export interface PieChartData {
  assetName: string;       // Name of the asset (e.g., "Apple")
  value: number;           // Value of the asset in the base currency
  percentage: number;      // Percentage of the total portfolio
  color: string;           // Color for the chart slice
  subcategory: string;     // Subcategory name (if applicable)
  subcategoryValue: number; // Value of the subcategory
  percentageOfSubcategory: number; // Percentage of the subcategory
}

export const fetchPortfolioPieChartData = async (
  accountId: string,
  category: string,
  baseCurrency: string
): Promise<PieChartData[]> => {
  try {
    const response = await axios.post('/api/portfolio/piechart-data', {
      accountId,
      category,
      baseCurrency,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio pie chart data:', error);
    throw new Error('Failed to fetch portfolio pie chart data');
  }
};

export const fetchPortfolioCombinedBarChartData = async (
  accountId: string | null,
  category: string
): Promise<{ name: string; value: number }[]> => {
  if (!accountId) {
    console.warn('Account ID is null, skipping fetch'); // Debug log
    return [];
  }

  try {
    const response = await axios.post(`/api/portfolio/barchart-data`, {
      accountId,
      category,
    });
    return response.data; // Assuming the backend returns an array of { name, value }
  } catch (error) {
    console.error('Error fetching portfolio chart data:', error);
    throw error;
  }
};