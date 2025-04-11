/**
 * Sends a POST request to update the market average data for the given symbols.
 * @param symbols - An array of market symbols (e.g., ["^GSPC", "^NDX"]).
 */
export const updateMarketAverageData = async (symbols: string[]): Promise<void> => {
  try {
    const response = await fetch('/api/market-average-data/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(symbols),
    });

    if (!response.ok) {
      throw new Error('Failed to update market average data');
    }

    console.log('Market average data update request sent successfully.');
  } catch (error) {
    console.error('Error updating market average data:', error);
    throw error;
  }
};

/**
 * Sends a GET request to fetch the market average data for the given symbols.
 * @param symbols - An array of market symbols (e.g., ["^GSPC", "^NDX"]).
 * @returns A promise that resolves to the market average data.
 */
export const fetchMarketAverageData = async (symbols: string[]): Promise<{ [key: string]: any }> => {
  try {
    const queryParams = symbols.map((symbol) => `indexNames=${encodeURIComponent(symbol)}`).join('&');
    const response = await fetch(`/api/market-average-data/fetch?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch market average data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching market average data:', error);
    throw error;
  }
};