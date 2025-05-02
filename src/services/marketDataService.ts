import axios from 'axios';
import { MarketDataProps } from '../types/MarketDataProps';

export const fetchMarketData = async (
  accountId: string,
  assets: { symbol: string; assetType: string }[]
): Promise<MarketDataProps[]> => {
  try {
    // Construct the request payload
    const payload = {
      accountId,
      assets, // Array of { symbol, assetType }
    };

    // Make the POST request
    const response = await axios.post('/api/market-data/fetch', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};