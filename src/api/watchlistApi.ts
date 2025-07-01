import { apiClient } from '../shared/utils/apiClient';
import { ApiResponse } from '../shared/types/ApiTypes';
import { WatchlistItem } from '../shared/types/MarketData';

// Fetch watchlist data
export const fetchWatchlistDataApi = async (accountId: string, assetTypes: string[]): Promise<ApiResponse<WatchlistItem[]>> => {
  try {
    const payload = {
      accountId,
      assetTypes,
    };

    const response = await apiClient.post<ApiResponse<WatchlistItem[]>>('/api/watchlist-data/fetch', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlist data:', error);
    throw error;
  }
};

// Add an item to the watchlist
export const addWatchlistItemApi = async (accountId: string, symbol: string, assetType: string): Promise<ApiResponse<WatchlistItem>> => {
  try {
    const payload = {
      accountId,
      symbol,
      assetType,
    };

    const response = await apiClient.post<ApiResponse<WatchlistItem>>('/api/watchlist-data/add', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding watchlist item:', error);
    throw error;
  }
};

// Remove an item from the watchlist
export const removeWatchlistItemApi = async (accountId: string, symbol: string, assetType: string): Promise<ApiResponse<void>> => {
  try {
    const payload = {
      accountId,
      symbol,
      assetType,
    };

    const response = await apiClient.delete<ApiResponse<void>>('/api/watchlist-data/remove', { data: payload });
    return response.data;
  } catch (error) {
    console.error('Error removing watchlist item:', error);
    throw error;
  }
};