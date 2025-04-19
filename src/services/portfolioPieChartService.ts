import axios from 'axios';

export const fetchPortfolioPieChartData = async (
  accountId: string,
  category: string
): Promise<{ name: string; value: number }[]> => {
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