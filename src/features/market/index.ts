// Export all market-related functionality
export * from './api';
export { fetchMarketData } from './services/marketDataService';
export { fetchMarketIndices, MARKET_INDEX_NAMES } from './services/marketIndexService';
export { fetchWatchlistData, addWatchlistItem, removeWatchlistItem } from './services/watchlistDataService';
export * from './types';
export * from './components';
export * from './hooks';