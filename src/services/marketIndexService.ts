import { fetchMarketIndexDataApi } from '../api/marketDataApi';
import { MarketIndexData } from '../types/MarketDataProps';
// Default symbols to fetch
const DEFAULT_SYMBOLS = ['^GSPC', '^NDX', '^DJI', '^RUT', 'GC=F', 'SI=F', 'CL=F'];

// Map of friendly names for market indices
export const MARKET_INDEX_NAMES: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^NDX': 'Nasdaq 100',
  '^DJI': 'Dow Jones',
  '^RUT': 'Russell 2000',
  'GC=F': 'Gold',
  'SI=F': 'Silver',
  'CL=F': 'Crude Oil'
};

// Fetch market index data
export const fetchMarketIndices = async (symbols = DEFAULT_SYMBOLS): Promise<MarketIndexData[]> => {
  try {
    const response = await fetchMarketIndexDataApi(symbols);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch market index data');
    }
    
    const result: MarketIndexData[] = [];
    
    // Check if data exists and transform it into our expected format
    if (response.data && typeof response.data === 'object') {
      // Loop through all requested symbols
      for (const symbol of symbols) {
        // If we have data for this symbol
        if (response.data[symbol]) {
          const indexData = response.data[symbol];
          
          result.push({
            symbol,
            name: MARKET_INDEX_NAMES[symbol] || symbol,
            price: indexData.price || 0,
            price_change: indexData.price_change || 0,
            percent_change: indexData.percent_change || 0,
            price_high: indexData.price_high,
            price_low: indexData.price_low
          });
        } else {
          // Include the symbol in the result with empty data
          // This makes the frontend show all requested symbols even if backend didn't return data
          result.push({
            symbol,
            name: MARKET_INDEX_NAMES[symbol] || symbol,
            price: 'N/A',
            price_change: 0,
            percent_change: 0
          });
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in fetchMarketIndices:', error);
    throw error;
  }
}; 