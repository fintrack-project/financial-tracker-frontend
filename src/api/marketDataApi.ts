import axios from 'axios';

// Fetch market data for a specific account and assets
export const fetchMarketDataApi = async (
  accountId: string,
  assets: { symbol: string; assetType: string }[]
) => {
  const payload = {
    accountId,
    assets, // Array of { symbol, assetType }
  };

  return axios.post('/api/market-data/fetch', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};