import { useState, useEffect, useCallback } from 'react';
import { fetchWatchlistData, addWatchlistItem, removeWatchlistItem } from '../services/watchlistDataService';
import { fetchMarketData } from '../services/marketDataService';
import { WatchlistRow } from '../types/WatchlistRow';

export const useWatchlist = (accountId: string | null, assetTypes: string[]) => {
  const [rows, setRows] = useState<WatchlistRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false); // Track if data has been fetched

  const fetchWatchlist = useCallback(async () => {
    if (!accountId) {
      console.warn('Account ID is required to fetch watchlist.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch saved watchlist items
      const savedItems = await fetchWatchlistData(accountId, assetTypes);
      if (!savedItems || savedItems.length === 0) {
        setRows([]);
        setHasFetched(true); // Mark as fetched even if no data
        return;
      }

      // Fetch market data for saved items
      const marketData = await fetchMarketData(
        accountId,
        savedItems.map((item) => ({ symbol: item.symbol, assetType: item.assetType }))
      );

      console.log('Market data:', marketData);

      // Map market data to rows
      const updatedRows = marketData.map((data) => ({
        symbol: data.symbol,
        assetType: data.assetType,
        price: data.price,
        priceChange: data.change,
        percentChange: data.percentChange,
        high: data.high,
        low: data.low,
        updatedTime: data.timestamp,
        confirmed: true,
      }));

      setRows(updatedRows);
      setHasFetched(true); // Mark as fetched
    } catch (err) {
      console.error('Error fetching watchlist data:', err);
      setError('Failed to fetch watchlist data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [accountId, assetTypes]);

  useEffect(() => {
    if (!hasFetched) {
      fetchWatchlist();
    }
  }, [fetchWatchlist, hasFetched]);

  const addRow = () => {
    // Add a new unconfirmed row
    setRows((prevRows) => [
      ...prevRows,
      { symbol: '', assetType: '', confirmed: false } as WatchlistRow,
    ]);
  };

  const confirmRow = async (index: number, defaultAssetType?: string) => {
    const row = rows[index];
    const assetType = row.assetType || defaultAssetType;

    if (!accountId || !row.symbol || !assetType) {
      alert('Symbol and Asset Type are required to confirm a row.');
      return;
    }

    try {
      await addWatchlistItem(accountId, row.symbol, assetType);
      setHasFetched(false);
    } catch (err) {
      console.error('Error confirming watchlist item:', err);
      alert('Failed to confirm watchlist item. Please try again.');
    }
  };

  const removeRow = async (index: number) => {
    const row = rows[index];
    if (!row.confirmed) {
      // If the row is unconfirmed, just remove it from the state
      setRows((prevRows) => prevRows.filter((_, i) => i !== index));
      return;
    }

    if (!accountId || !row.symbol || !row.assetType) {
      alert('Account ID, Symbol, and Asset Type are required to remove a watchlist item.');
      return;
    }

    try {
      await removeWatchlistItem(accountId, row.symbol, row.assetType);
      setHasFetched(false); // Trigger a refetch to fetch updated data
    } catch (err) {
      console.error('Error removing watchlist item:', err);
      alert('Failed to remove watchlist item. Please try again.');
    }
  };

  const resetHasFetched = () => {
    setHasFetched(false); // Allow components to trigger a refetch
  };

  return { rows, setRows, error, loading, addRow, confirmRow, removeRow, resetHasFetched };
};