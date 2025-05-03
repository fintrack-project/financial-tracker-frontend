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
}

export const fetchWatchlistData = async (accountId: string, assetTypes: string[]): Promise<WatchlistDataProps[]> => {
  try {
    // Make the POST request
    const response = await fetchWatchlistDataApi(accountId, assetTypes);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved watchlist items:', error);
    throw error;
  }
};

// Add an item to the watchlist
export const addWatchlistItem = async (accountId: string, symbol: string, assetType: string): Promise<string> => {
  try {
    // Make the POST request
    const response = await addWatchlistItemApi(accountId, symbol, assetType);
    return response.data; // Return success message
  } catch (error) {
    console.error('Error adding item to watchlist:', error);
    throw error;
  }
};

// Remove an item from the watchlist
export const removeWatchlistItem = async (accountId: string, symbol: string, assetType: string): Promise<string> => {
  try {
    // Make the DELETE request
    const response = await removeWatchlistItemApi(accountId, symbol, assetType);
    return response.data; // Return success message
  } catch (error) {
    console.error('Error removing item from watchlist:', error);
    throw error;
  }
};