import React, { Dispatch, SetStateAction, useMemo } from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useMarketData } from '../../hooks/useMarketData';
import { MarketDataDisplay } from '../../types/MarketData';
import { SubscriptionPlanType } from '../../../subscription/types/SubscriptionPlan';
import './Watchlist.css';

interface MarketWatchlistProps {
  accountId: string | null;
  subscriptionPlan: SubscriptionPlanType;
}

const MarketWatchlist: React.FC<MarketWatchlistProps> = ({ 
  accountId,
  subscriptionPlan = 'FREE'
}) => {
  const marketWatchAssetTypes = useMemo(() => ['STOCK', 'CRYPTO', 'COMMODITY'], []);
  const { watchlistItems, setWatchlistItems, error: watchlistError, loading: watchlistLoading, addRow, confirmRow, removeRow } = useWatchlist(accountId, marketWatchAssetTypes);
  
  // Only fetch market data for confirmed items
  const confirmedItems = watchlistItems.filter(item => item.confirmed);
  const { marketData, loading: marketLoading, error: marketError, lastUpdated } = useMarketData({
    accountId,
    items: confirmedItems,
    subscriptionPlan
  });

  // Combine watchlist items with market data
  const rows: MarketDataDisplay[] = watchlistItems.map(item => {
    // For unconfirmed items, just return the basic data
    if (!item.confirmed) {
      return {
        symbol: item.symbol,
        assetType: item.assetType,
        price: 0,
        priceChange: 0,
        percentChange: 0,
        high: 0,
        low: 0,
        confirmed: false
      };
    }

    // For confirmed items, include market data
    const marketItem = marketData.find(m => m.symbol === item.symbol && m.assetType === item.assetType);
    return {
      symbol: item.symbol,
      assetType: item.assetType,
      price: marketItem?.price ?? 0,
      priceChange: marketItem?.change ?? 0,
      percentChange: marketItem?.percentChange ?? 0,
      high: marketItem?.high ?? 0,
      low: marketItem?.low ?? 0,
      confirmed: true
    };
  });

  const columns: { key: keyof MarketDataDisplay; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'AAPL' },
    { key: 'assetType', label: 'Asset Type', editable: true, placeholder: 'STOCK' },
    { key: 'price', label: 'Price (USD)' },
    { key: 'priceChange', label: 'Price Change (USD)' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High (USD)' },
    { key: 'low', label: 'Low (USD)' }
  ];

  const handleConfirmRow = async (index: number) => {
    try {
      await confirmRow(index);
    } catch (error) {
      console.error('Error confirming row:', error);
    }
  };

  const handleSetRows: Dispatch<SetStateAction<MarketDataDisplay[]>> = (value) => {
    if (typeof value === 'function') {
      // Handle function updater
      const newRows = value(rows);
      // Update the watchlist items with the new values
      const updatedItems = newRows.map(row => ({
        symbol: row.symbol,
        assetType: row.assetType,
        confirmed: row.confirmed
      }));
      setWatchlistItems(updatedItems);
    } else {
      // Handle direct value
      const updatedItems = value.map(row => ({
        symbol: row.symbol,
        assetType: row.assetType,
        confirmed: row.confirmed
      }));
      setWatchlistItems(updatedItems);
    }
  };

  return (
    <div className="watchlist-widget">
      <div className="watchlist-widget-header">
        <h3>Market Watchlist</h3>
        {lastUpdated && (
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="watchlist-content">
        {((watchlistError && watchlistError.trim()) || (marketError && marketError.trim())) && (
          <div className="error-message">{watchlistError || marketError}</div>
        )}
        {(watchlistLoading || marketLoading) && <div className="loading-message">Loading...</div>}
        <EditableWatchlistTable<MarketDataDisplay>
          columns={columns}
          rows={rows}
          setRows={handleSetRows}
          onAddRow={addRow}
          onConfirmRow={handleConfirmRow}
          onRemoveRow={removeRow}
          resetHasFetched={() => {}}
        />
      </div>
    </div>
  );
};

export default MarketWatchlist;