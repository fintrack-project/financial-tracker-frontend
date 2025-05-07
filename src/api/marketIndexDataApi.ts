import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';
import { MarketIndexData } from '../types/MarketDataProps';

// Fetch market index data
export const fetchMarketIndexDataApi = async (symbols: string[]): Promise<ApiResponse<MarketIndexData[]>> => {
  try {
    const queryParams = symbols.map((name) => `symbols=${encodeURIComponent(name)}`).join('&');
    const response = await apiClient.get<ApiResponse<MarketIndexData[]>>(`/api/market-index-data/fetch?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market index data:', error);
    throw error;
  }
};