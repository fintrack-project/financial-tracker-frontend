import React from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useMarketData } from '../../hooks/useMarketData';
import { MarketDataDisplay } from '../../types/MarketData';
import { SubscriptionPlan } from '../../hooks/useRefreshCycle';

interface MarketWatchlistProps {
  accountId: string | null;
  subscriptionPlan?: SubscriptionPlan;
}

const MarketWatchlist: React.FC<MarketWatchlistProps> = ({ 
  accountId,
  subscriptionPlan = 'FREE'
}) => {
  const marketWatchAssetTypes = ['STOCK', 'CRYPTO', 'COMMODITY'];
  const { watchlistItems, error: watchlistError, loading: watchlistLoading, addRow, confirmRow, removeRow } = useWatchlist(accountId, marketWatchAssetTypes);
  
  const { marketData, loading: marketLoading, error: marketError, lastUpdated } = useMarketData({
    accountId,
    symbols: watchlistItems,
    subscriptionPlan
  });

  // Combine watchlist items with market data
  const rows: MarketDataDisplay[] = watchlistItems.map(item => {
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
      <EditableWatchlistTable<MarketDataDisplay>
        columns={columns}
        rows={rows}
        setRows={() => {}} // We don't need this anymore as rows are derived from watchlistItems and marketData
        onAddRow={addRow}
        onConfirmRow={(index) => confirmRow(index)}
        onRemoveRow={removeRow}
        resetHasFetched={() => {}} // We don't need this anymore as refresh is handled by useMarketData
      />
    </div>
  );
};

export default MarketWatchlist;