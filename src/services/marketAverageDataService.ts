import axios from 'axios';

export const fetchMarketAverageData = async (symbols: string[]): Promise<{ [key: string]: any }> => {
  try {
    const queryParams = symbols.map((symbol) => `indexNames=${encodeURIComponent(symbol)}`).join('&');
    const response = await axios.get(`/api/market-average-data/fetch?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching market average data:', error);
    throw error;
  }
};