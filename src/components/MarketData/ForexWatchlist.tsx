import React from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { useWatchlist } from '../../hooks/useWatchlist';
import { WatchlistRow } from '../../types/WatchlistRow';

const ForexWatchlist: React.FC<{ accountId: string | null }> = ({ accountId }) => {
  const forexAssetTypes = ['FOREX'];
  const { rows, setRows, error, loading, addRow, removeRow, resetHasFetched } = useWatchlist(accountId, forexAssetTypes);

  const columns: { key: keyof WatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'EUR/USD' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' },
    { key: 'updatedTime', label: 'Updated Time' },
    // { key: 'confirmed', label: '', editable: false },
  ];

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      <EditableWatchlistTable<WatchlistRow>
        columns={columns}
        fetchData={async (row) => row} // No additional fetch needed for now
        accountId={accountId}
        rows={rows}
        setRows={setRows}
        onAddRow={addRow}
        onRemoveRow={removeRow}
        resetHasFetched={resetHasFetched} // Pass resetHasFetched
      />
    </div>
  );
};

export default ForexWatchlist;