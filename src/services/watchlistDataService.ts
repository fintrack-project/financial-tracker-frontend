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

// Add an item to the watchlist
export const addWatchlistItem = async (accountId: string, symbol: string, assetType: string): Promise<string> => {
  try {
    // Construct the request payload
    const payload = {
      accountId,
      symbol,
      assetType,
    };

    // Make the POST request
    const response = await axios.post('/api/watchlist-data/add', payload);
    return response.data; // Return success message
  } catch (error) {
    console.error('Error adding item to watchlist:', error);
    throw error;
  }
};

// Remove an item from the watchlist
export const removeWatchlistItem = async (accountId: string, symbol: string, assetType: string): Promise<string> => {
  try {
    // Construct the request payload
    const payload = {
      accountId,
      symbol,
      assetType,
    };

    // Make the DELETE request
    const response = await axios.delete('/api/watchlist-data/remove', { data: payload });
    return response.data; // Return success message
  } catch (error) {
    console.error('Error removing item from watchlist:', error);
    throw error;
  }
};