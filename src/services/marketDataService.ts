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

export const updateMarketData = async (assetNames: string[]): Promise<void> => {
  try {
    await axios.post('/api/market-data/update', assetNames);
    console.log('Market data update request sent successfully.');
  } catch (error) {
    console.error('Error updating market data:', error);
    throw error;
  }
};

export const fetchMarketData = async (assetNames: string[]): Promise<MarketDataProps[]> => {
  try {
    const queryParams = assetNames.map((name) => `assetNames=${encodeURIComponent(name)}`).join('&');
    const response = await axios.get(`/api/market-data/fetch?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};