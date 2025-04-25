import React, { useState, useEffect } from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';

interface ForexWatchlistRow {
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
  const [rows, setRows] = useState<ForexWatchlistRow[]>([]); // State to store watchlist rows

  const columns: { key: keyof ForexWatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'EUR/USD' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' },
    { key: 'updatedTime', label: 'Updated Time' },
  ];

  // Fetch saved watchlist items and their market data
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!accountId) {
        setError('Account ID is required to fetch watchlist.');
        return;
      }

      try {
        // Fetch saved watchlist items
        const savedItems = await fetchSavedWatchlistForexItems(accountId); // Fetch symbols and asset types
        if (!savedItems || savedItems.length === 0) {
          setRows([]); // No saved items
          return;
        }

        // Fetch forex data for saved items
        const forexData = await fetchForexData(
          accountId,
          savedItems.map((item) => item.symbol)
        );

        // Map forex data to rows
        const updatedRows = forexData.map((data) => ({
          symbol: data.symbol,
          assetType: 'FOREX', // Assuming all items in ForexWatchlist are FOREX
          price: data.price,
          priceChange: data.change,
          percentChange: data.percentChange,
          high: data.high,
          low: data.low,
          updatedTime: data.updatedTime,
          confirmed: true,
        }));

        setRows(updatedRows); // Update rows with fetched data
      } catch (err) {
        console.error('Error fetching watchlist data:', err);
        setError('Failed to fetch watchlist data. Please try again later.');
      }
    };

    fetchWatchlist();
  }, [accountId]);

  const fetchData = async (row: ForexWatchlistRow): Promise<ForexWatchlistRow> => {
    if (!accountId) {
      alert('Account ID is required to confirm holdings categories.');
      return Promise.reject(new Error('Account ID is required'));
    }

    if (!row.symbol) throw new Error('Symbol is required');

    try {
      const data = await fetchForexData(accountId, [row.symbol]);
      if (!data || data.length === 0) {
        throw new Error('No data returned from the server');
      }

      return {
        symbol: row.symbol,
        assetType: 'FOREX',
        price: data[0].price,
        priceChange: data[0].priceChange,
        percentChange: data[0].percentChange,
        high: data[0].high,
        low: data[0].low,
        updatedTime: data[0].updatedTime,
        confirmed: true,
      };
    } catch (err) {
      console.error('Error fetching forex data:', err);
      setError('Failed to fetch forex data. Please try again later.');
      return Promise.reject(err); // Re-throw the error for further handling
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>} {/* Display error message */}
      <EditableWatchlistTable<ForexWatchlistRow>
        columns={columns}
        fetchData={fetchData}
        accountId={accountId}
        rows={rows} // Pass rows to the table
        setRows={setRows} // Allow table to update rows
      />
    </div>
  );
};

export default ForexWatchlist;