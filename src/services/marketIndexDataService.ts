import { fetchMarketIndexDataApi } from "../api/marketIndexDataApi";

interface MarketIndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export const fetchMarketIndexData = async (symbols: string[]): Promise<MarketIndexData[]> => {
  try {
    const response = await fetchMarketIndexDataApi(symbols);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch market index data');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching market index data:', error);
    throw error;
  }
};