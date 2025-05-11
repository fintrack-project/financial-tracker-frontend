import { useState, useEffect } from 'react';
import { fetchWatchlistData, addWatchlistItem, removeWatchlistItem } from '../services/watchlistDataService';
import { WatchlistItem } from '../types/MarketData';

export const useWatchlist = (accountId: string | null, assetTypes: string[]) => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWatchlist = async () => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const savedItems = await fetchWatchlistData(accountId, assetTypes);
      setWatchlistItems(savedItems.map(item => ({
        symbol: item.symbol,
        assetType: item.assetType
      })));
    } catch (err) {
      console.error('Error fetching watchlist data:', err);
      setError('Failed to fetch watchlist data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [accountId, JSON.stringify(assetTypes)]);

  const addRow = () => {
    setWatchlistItems(prev => [...prev, { symbol: '', assetType: '' }]);
  };

  const confirmRow = async (index: number, defaultAssetType?: string) => {
    const item = watchlistItems[index];
    const assetType = item.assetType || defaultAssetType;

    if (!accountId || !item.symbol || !assetType) {
      alert('Symbol and Asset Type are required to confirm a row.');
      return;
    }

    try {
      await addWatchlistItem(accountId, item.symbol, assetType);
      await fetchWatchlist(); // Refresh the list
    } catch (err) {
      console.error('Error confirming watchlist item:', err);
      alert('Failed to confirm watchlist item. Please try again.');
    }
  };

  const removeRow = async (index: number) => {
    const item = watchlistItems[index];
    if (!accountId || !item.symbol || !item.assetType) {
      alert('Account ID, Symbol, and Asset Type are required to remove a watchlist item.');
      return;
    }

    try {
      await removeWatchlistItem(accountId, item.symbol, item.assetType);
      await fetchWatchlist(); // Refresh the list
    } catch (err) {
      console.error('Error removing watchlist item:', err);
      alert('Failed to remove watchlist item. Please try again.');
    }
  };

  return {
    watchlistItems,
    error,
    loading,
    addRow,
    confirmRow,
    removeRow
  };
};