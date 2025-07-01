// import axios from 'axios';
import { 
  fetchWatchlistDataApi,
  addWatchlistItemApi,
  removeWatchlistItemApi
} from '../api/watchlistApi';
import { WatchlistItem } from '../shared/types/MarketData';

export const fetchWatchlistData = async (accountId: string, assetTypes: string[]): Promise<WatchlistItem[]> => {
  try {
    const response = await fetchWatchlistDataApi(accountId, assetTypes);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch watchlist data');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching saved watchlist items:', error);
    throw error;
  }
};

// Add an item to the watchlist
export const addWatchlistItem = async (accountId: string, symbol: string, assetType: string): Promise<void> => {
  try {
    const response = await addWatchlistItemApi(accountId, symbol, assetType);
    // Check if response is successful, even if message contains "success"
    if (response.success) {
      return; // Successfully added
    }
    // Only throw error if response is not successful
    throw new Error(response.message || 'Failed to add watchlist item');
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