import { apiClient } from '../utils/apiClient';
import { MarketDataProps } from '../types/MarketDataProps';
import { ApiResponse } from '../types/ApiTypes';
import { Asset } from '../types/Asset';

// Fetch market data for a specific account and assets
export const fetchMarketDataApi = async (
  accountId: string,
  assets: Asset[]
): Promise<ApiResponse<MarketDataProps[]>> => {
  try {
    const response = await apiClient.post<ApiResponse<MarketDataProps[]>>('/api/market-data/fetch', {
      accountId,
      assets,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};