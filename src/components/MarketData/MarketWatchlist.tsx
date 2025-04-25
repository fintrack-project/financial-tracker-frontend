import React from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { useWatchlist } from '../../hooks/useWatchlist';
import { WatchlistRow } from '../../types/WatchlistRow';

const MarketWatchlist: React.FC<{ accountId: string | null }> = ({ accountId }) => {
  const marketWatchAssetTypes = ['STOCK', 'CRYPTO', 'COMMODITY'];
  const { rows, setRows, error, loading, addRow, confirmRow, removeRow, resetHasFetched } = useWatchlist(accountId, marketWatchAssetTypes);

  const columns: { key: keyof WatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'AAPL' },
    { key: 'assetType', label: 'Asset Type', editable: true, placeholder: 'STOCK' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' },
    { key: 'updatedTime', label: 'Updated Time' },
  ];

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      <EditableWatchlistTable<WatchlistRow>
        columns={columns}
        rows={rows}
        setRows={setRows}
        onAddRow={addRow}
        onConfirmRow={(index) => confirmRow(index)}
        onRemoveRow={removeRow}
        resetHasFetched={resetHasFetched}
      />
    </div>
  );
};

export default MarketWatchlist;