import axios from 'axios';

export interface WatchlistDataProps {
  id: number;
  symbol: string;
  assetType: string;
}

export const fetchWatchlistData = async (accountId: string, assetTypes: string[]): Promise<WatchlistDataProps[]> => {
  try {
    // Construct the request payload
    const payload = {
      accountId,
      assetTypes,
    };

    // Make the POST request
    const response = await axios.post('/api/watchlist-data/fetch', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved watchlist items:', error);
    throw error;
  }
};