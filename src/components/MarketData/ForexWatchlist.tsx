import React, { useState } from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { fetchForexData } from '../../services/forexDataService';

interface MarketWatchlistRow {
  symbol?: string;
  assetType?: string;
  price?: number;
  priceChange?: number;
  percentChange?: number;
  high?: number;
  low?: number;
  updatedTime?: string;
  confirmed?: boolean;
}

const ForexWatchlist: React.FC<{ accountId: string | null }> = ({ accountId }) => {
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const columns: { key: keyof MarketWatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'EUR/USD' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' },
    { key: 'updatedTime', label: 'Updated Time' },
  ];

  const fetchData = async (row: MarketWatchlistRow) => {
    if (!accountId) {
      alert('Account ID is required to confirm holdings categories.');
      return;
    }

    if (!row.symbol) throw new Error('Symbol is required');

    try {
      const data = await fetchForexData(accountId, [row.symbol]);
      return data[0]; // Assume backend returns an array
    } catch (err) {
      console.error('Error fetching forex data:', err);
      setError('Failed to fetch forex data. Please try again later.');
      throw err; // Re-throw the error if needed for further handling
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>} {/* Display error message */}
      <EditableWatchlistTable<MarketWatchlistRow> 
        columns={columns} 
        fetchData={fetchData} 
        accountId={accountId}
      />
    </div>
  );
};

export default ForexWatchlist;