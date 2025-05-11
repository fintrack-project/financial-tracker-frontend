import React from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { useWatchlist } from '../../hooks/useWatchlist';
import { WatchlistRow } from '../../types/WatchlistRow';

const ForexWatchlist: React.FC<{ accountId: string | null }> = ({ accountId }) => {
  const forexAssetTypes = ['FOREX'];
  const { rows, setRows, error, loading, addRow, confirmRow, removeRow, resetHasFetched } = useWatchlist(accountId, forexAssetTypes);

  const columns: { key: keyof WatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'EUR/USD' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' }
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
        onConfirmRow={(index) => confirmRow(index, 'FOREX')}
        onRemoveRow={removeRow}
        resetHasFetched={resetHasFetched}
      />
    </div>
  );
};

export default ForexWatchlist;