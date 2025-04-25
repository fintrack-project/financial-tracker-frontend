import React, { useState } from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { fetchMarketData } from '../../services/marketDataService';

interface MarketWatchlistRow {
  symbol?: string;
  assetType?: string;
  price?: number;
  priceChange?: number;
  percentChange?: number;
  high?: number;
  low?: number;
  confirmed?: boolean;
}

const MarketWatchlist: React.FC<{ accountId: string | null }> = ({ accountId }) => {
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const columns: { key: keyof MarketWatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'AAPL' },
    { key: 'assetType', label: 'Asset Type', editable: true, placeholder: 'STOCK' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' },
  ];

  const fetchData = async (row: MarketWatchlistRow): Promise<MarketWatchlistRow> => {
    if (!accountId) {
      alert('Account ID is required to confirm holdings categories.');
      return Promise.reject(new Error('Account ID is required'));
    }

    if (!row.symbol || !row.assetType) {
      throw new Error('Symbol and Asset Type are required');
    }

    try {
      const data = await fetchMarketData(accountId, [row.symbol]);
      console.log('Fetched market data:', data); // Debug log
      if (!data || data.length === 0) {
        throw new Error('No data returned from the server');
      }

      // Map the fetched data to the MarketWatchlistRow structure
      return {
        symbol: row.symbol,
        assetType: row.assetType,
        price: data[0].price,
        priceChange: data[0].change,
        percentChange: data[0].percentChange,
        high: data[0].high,
        low: data[0].low,
        confirmed: true,
      };
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data. Please try again later.');
      return Promise.reject(err); // Re-throw the error for further handling
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

export default MarketWatchlist;