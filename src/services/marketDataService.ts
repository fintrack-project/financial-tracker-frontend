// import axios from 'axios';
import { fetchMarketDataApi } from '../api/marketDataApi';
import { MarketDataProps } from '../types/MarketDataProps';

export const fetchMarketData = async (
  accountId: string,
  assets: { symbol: string; assetType: string }[]
): Promise<MarketDataProps[]> => {
  try {
    // Make the POST request
    const response = await fetchMarketDataApi(accountId, assets);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};