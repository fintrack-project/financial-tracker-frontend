export interface MarketDataProps {
  id: number;
  symbol: string;
  price: number;
  percentChange: number;
  timestamp: string;
  assetName: string;
  priceUnit: string;
}

/**
 * Sends a POST request to update the market data for the given asset names.
 * @param assetNames - An array of asset names (e.g., ["AAPL", "GOOGL"]).
 */
export const updateMarketData = async (assetNames: string[]): Promise<void> => {
  try {
    const response = await fetch('/api/market-data/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assetNames),
    });

    if (!response.ok) {
      throw new Error('Failed to update market data');
    }

    console.log('Market data update request sent successfully.');
  } catch (error) {
    console.error('Error updating market data:', error);
    throw error;
  }
};

/**
 * Sends a GET request to fetch the market data for the given asset names.
 * @param assetNames - An array of asset names (e.g., ["AAPL", "GOOGL"]).
 * @returns A promise that resolves to the market data.
 */
export const fetchMarketData = async (assetNames: string[]): Promise<MarketDataProps[]> => {
  try {
    const queryParams = assetNames.map((name) => `assetNames=${encodeURIComponent(name)}`).join('&');
    const response = await fetch(`/api/market-data/fetch?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};