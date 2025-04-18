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

export const fetchMarketData = async (symbols: string[]): Promise<MarketDataProps[]> => {
  try {
    const queryParams = symbols.map((name) => `symbols=${encodeURIComponent(name)}`).join('&');
    const response = await axios.get(`/api/market-data/fetch?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};