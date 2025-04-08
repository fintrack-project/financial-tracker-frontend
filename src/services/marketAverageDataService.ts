export const fetchMarketAverageData = async (symbols: string[]): Promise<{ [key: string]: { price: string; percent_change: string } }> => {
  try {
    const response = await fetch(`/api/market-average-data?symbols=${symbols.join(',')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch market data from backend');
    }

    const data = await response.json();
    return data; // Assuming the response structure matches the backend output
  } catch (error) {
    console.error('Error fetching market data from backend:', error);
    throw error;
  }
};