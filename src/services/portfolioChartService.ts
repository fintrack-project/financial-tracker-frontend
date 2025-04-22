import axios from 'axios';

export const fetchPortfolioPieChartData = async (
  accountId: string,
  category: string
): Promise<{ name: string; value: number }[]> => {
  if (!accountId) {
    throw new Error('Account ID is required to fetch portfolio pie chart data');
  }

  try {
    const response = await axios.post(`/api/portfolio/piechart-data`, {
      accountId,
      category,
    });
    return response.data; // Assuming the backend returns an array of { name, value }
  } catch (error) {
    console.error('Error fetching portfolio chart data:', error);
    throw error;
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