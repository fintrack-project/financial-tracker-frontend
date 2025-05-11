import React from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useMarketData } from '../../hooks/useMarketData';
import { WatchlistRow } from '../../types/WatchlistRow';
import { SubscriptionPlan } from '../../hooks/useRefreshCycle';

interface ForexWatchlistProps {
  accountId: string | null;
  subscriptionPlan?: SubscriptionPlan;
}

const ForexWatchlist: React.FC<ForexWatchlistProps> = ({ 
  accountId,
  subscriptionPlan = 'FREE'
}) => {
  const forexAssetTypes = ['FOREX'];
  const { watchlistItems, error: watchlistError, loading: watchlistLoading, addRow, confirmRow, removeRow } = useWatchlist(accountId, forexAssetTypes);
  
  const { marketData, loading: marketLoading, error: marketError, lastUpdated } = useMarketData({
    accountId,
    symbols: watchlistItems,
    subscriptionPlan
  });

  // Combine watchlist items with market data
  const rows: WatchlistRow[] = watchlistItems.map(item => {
    const marketItem = marketData.find(m => m.symbol === item.symbol && m.assetType === item.assetType);
    return {
      symbol: item.symbol,
      assetType: item.assetType,
      price: marketItem?.price,
      priceChange: marketItem?.change,
      percentChange: marketItem?.percentChange,
      high: marketItem?.high,
      low: marketItem?.low,
      confirmed: true
    };
  });

  const columns: { key: keyof WatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'EUR/USD' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' }
  ];

  return (
    <div className="editable-watchlist-table-container">
      <div className="editable-watchlist-header">
        {(watchlistError || marketError) && <div className="error-message">{watchlistError || marketError}</div>}
        {(watchlistLoading || marketLoading) && <div className="loading-message">Loading...</div>}
        {lastUpdated && (
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
      <EditableWatchlistTable<WatchlistRow>
        columns={columns}
        rows={rows}
        setRows={() => {}} // We don't need this anymore as rows are derived from watchlistItems and marketData
        onAddRow={addRow}
        onConfirmRow={(index) => confirmRow(index, 'FOREX')}
        onRemoveRow={removeRow}
        resetHasFetched={() => {}} // We don't need this anymore as refresh is handled by useMarketData
      />
    </div>
  );
};

export default ForexWatchlist;