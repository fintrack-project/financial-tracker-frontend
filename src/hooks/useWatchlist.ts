import { useState, useEffect } from 'react';
import { fetchWatchlistData, addWatchlistItem, removeWatchlistItem } from '../services/watchlistDataService';
import { WatchlistItem } from '../types/MarketData';

export const useWatchlist = (accountId: string | null, assetTypes: string[]) => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWatchlist = async () => {
    if (!accountId) {
      console.log('❌ No accountId provided, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('📥 Fetching watchlist data...', { accountId, assetTypes });
      setLoading(true);
      const savedItems = await fetchWatchlistData(accountId, assetTypes);
      console.log('✅ Watchlist data fetched:', savedItems);
      
      const mappedItems = savedItems.map(item => ({
        symbol: item.symbol,
        assetType: item.assetType,
        confirmed: true
      }));
      console.log('🔄 Mapped watchlist items:', mappedItems);
      
      setWatchlistItems(mappedItems);
    } catch (err) {
      console.error('❌ Error fetching watchlist data:', err);
      setError('Failed to fetch watchlist data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 Watchlist effect triggered:', { accountId, assetTypes });
    fetchWatchlist();
  }, [accountId, JSON.stringify(assetTypes)]);

  const addRow = () => {
    console.log('➕ Adding new row to watchlist');
    setWatchlistItems(prev => {
      const newItems = [...prev, { symbol: '', assetType: '', confirmed: false }];
      console.log('📝 Updated watchlist items:', newItems);
      return newItems;
    });
  };

  const confirmRow = async (index: number, defaultAssetType?: string) => {
    const item = watchlistItems[index];
    const assetType = item.assetType || defaultAssetType;
    
    console.log('🔍 Confirming row:', { 
      index, 
      item, 
      assetType,
      accountId,
      hasSymbol: !!item.symbol,
      hasAssetType: !!assetType
    });

    if (!accountId || !item.symbol || !assetType) {
      console.warn('⚠️ Missing required fields:', { 
        hasAccountId: !!accountId, 
        hasSymbol: !!item.symbol, 
        hasAssetType: !!assetType 
      });
      alert('Symbol and Asset Type are required to confirm a row.');
      return;
    }

    try {
      console.log('📤 Adding watchlist item to backend:', { 
        accountId, 
        symbol: item.symbol, 
        assetType 
      });
      setLoading(true);
      await addWatchlistItem(accountId, item.symbol, assetType);
      console.log('✅ Watchlist item added successfully');
      
      console.log('🔄 Refreshing watchlist...');
      await fetchWatchlist();
    } catch (err) {
      console.error('❌ Error confirming watchlist item:', err);
      alert('Failed to confirm watchlist item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeRow = async (index: number) => {
    const item = watchlistItems[index];
    console.log('🗑️ Removing row:', { index, item });

    if (!accountId || !item.symbol || !item.assetType) {
      console.warn('⚠️ Missing required fields for removal:', { 
        hasAccountId: !!accountId, 
        hasSymbol: !!item.symbol, 
        hasAssetType: !!item.assetType 
      });
      alert('Account ID, Symbol, and Asset Type are required to remove a watchlist item.');
      return;
    }

    try {
      console.log('📤 Removing watchlist item from backend:', { 
        accountId, 
        symbol: item.symbol, 
        assetType: item.assetType 
      });
      setLoading(true);
      await removeWatchlistItem(accountId, item.symbol, item.assetType);
      console.log('✅ Watchlist item removed successfully');
      
      console.log('🔄 Refreshing watchlist...');
      await fetchWatchlist();
    } catch (err) {
      console.error('❌ Error removing watchlist item:', err);
      alert('Failed to remove watchlist item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    watchlistItems,
    setWatchlistItems,
    error,
    loading,
    addRow,
    confirmRow,
    removeRow
  };
};