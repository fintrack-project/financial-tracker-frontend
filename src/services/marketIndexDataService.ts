import { fetchMarketIndexDataApi } from "../api/marketIndexDataApi";

export const fetchMarketIndexData = async (symbols: string[]): Promise<{ [key: string]: any }> => {
  try {
    const response = await fetchMarketIndexDataApi(symbols);
    return response.data;
  } catch (error) {
    console.error('Error fetching market index data:', error);
    throw error;
  }
};