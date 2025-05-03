import axios from 'axios';

// Fetch watchlist data
export const fetchWatchlistDataApi = async (accountId: string, assetTypes: string[]) => {
  const payload = {
    accountId,
    assetTypes,
  };

  return axios.post('/api/watchlist-data/fetch', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Add an item to the watchlist
export const addWatchlistItemApi = async (accountId: string, symbol: string, assetType: string) => {
  const payload = {
    accountId,
    symbol,
    assetType,
  };

  return axios.post('/api/watchlist-data/add', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Remove an item from the watchlist
export const removeWatchlistItemApi = async (accountId: string, symbol: string, assetType: string) => {
  const payload = {
    accountId,
    symbol,
    assetType,
  };

  return axios.delete('/api/watchlist-data/remove', { data: payload });
};