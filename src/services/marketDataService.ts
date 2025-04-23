import axios from 'axios';

export interface MarketDataProps {
  id: number;
  symbol: string;
  price: number;
  percentChange: number;
  timestamp: string;
  assetName: string;
  priceUnit: string;
}

export const fetchMarketData = async (accountId: string, symbols: string[]): Promise<MarketDataProps[]> => {
  try {
    // Encode accountId and symbols for the query parameters
    const encodedAccountId = encodeURIComponent(accountId);
    const encodedSymbols = symbols.map((symbol) => `symbols=${encodeURIComponent(symbol)}`).join('&');

    // Construct the query string
    const queryParams = `accountId=${encodedAccountId}&${encodedSymbols}`;

    // Make the API request
    const response = await axios.get(`/api/market-data/fetch?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};