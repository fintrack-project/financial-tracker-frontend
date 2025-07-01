import { apiClient } from '../shared/utils/apiClient';
import { MarketData } from '../shared/types/MarketData';
import { ApiResponse } from '../shared/types/ApiTypes';
import { Asset } from '../shared/types/Asset';

// Fetch market data for a specific account and assets
export const fetchMarketDataApi = async (
  accountId: string,
  assets: Asset[]
): Promise<ApiResponse<MarketData[]>> => {
  try {
    const response = await apiClient.post<ApiResponse<MarketData[]>>('/api/market-data/fetch', {
      accountId,
      assets,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

// Fetch market index data for specified symbols
export const fetchMarketIndexDataApi = async (symbols: string[]): Promise<ApiResponse<Record<string, any>>> => {
  try {
    // URL encode each symbol correctly and join with commas
    const encodedSymbols = symbols.map(symbol => encodeURIComponent(symbol)).join(',');
    
    const response = await apiClient.get<ApiResponse<Record<string, any>>>('/api/market-index-data/fetch', {
      params: { symbols: encodedSymbols }
    });
    console.log('Market index data response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching market index data:', error);
    throw error;
  }
};