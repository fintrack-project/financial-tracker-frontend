// import axios from 'axios';
import { 
  fetchWatchlistDataApi,
  addWatchlistItemApi,
  removeWatchlistItemApi
} from '../api/watchlistApi';

export interface WatchlistDataProps {
  id: number;
  symbol: string;
  assetType: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const fetchWatchlistData = async (accountId: string, assetTypes: string[]): Promise<WatchlistDataProps[]> => {
  try {
    const response = await fetchWatchlistDataApi(accountId, assetTypes);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch watchlist data');
    }
    return response.data.map(item => ({
      id: 0, // Since the API doesn't provide an id, we'll use 0 as default
      ...item
    }));
  } catch (error) {
    console.error('Error fetching saved watchlist items:', error);
    throw error;
  }
};

// Add an item to the watchlist
export const addWatchlistItem = async (accountId: string, symbol: string, assetType: string): Promise<WatchlistDataProps> => {
  try {
    const response = await addWatchlistItemApi(accountId, symbol, assetType);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to add watchlist item');
    }
    return {
      id: 0, // Since the API doesn't provide an id, we'll use 0 as default
      ...response.data
    };
  } catch (error) {
    console.error('Error adding item to watchlist:', error);
    throw error;
  }
};

// Remove an item from the watchlist
export const removeWatchlistItem = async (accountId: string, symbol: string, assetType: string): Promise<void> => {
  try {
    const response = await removeWatchlistItemApi(accountId, symbol, assetType);
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove watchlist item');
    }
  } catch (error) {
    console.error('Error removing item from watchlist:', error);
    throw error;
  }
};