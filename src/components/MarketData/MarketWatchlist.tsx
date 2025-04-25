import React, { useState, useEffect } from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';

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
  const [rows, setRows] = useState<MarketWatchlistRow[]>([]); // State to store watchlist rows

  const columns: { key: keyof MarketWatchlistRow; label: string; editable?: boolean; placeholder?: string }[] = [
    { key: 'symbol', label: 'Symbol', editable: true, placeholder: 'AAPL' },
    { key: 'assetType', label: 'Asset Type', editable: true, placeholder: 'STOCK' },
    { key: 'price', label: 'Price' },
    { key: 'priceChange', label: 'Price Change' },
    { key: 'percentChange', label: '% Change' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' },
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
        const savedItems = await fetchSavedWatchlistMarketDataItems(accountId); // Fetch symbols and asset types
        if (!savedItems || savedItems.length === 0) {
          setRows([]); // No saved items
          return;
        }

        // Fetch market data for saved items
        const marketData = await fetchWatchlistMarketData(
          accountId,
          savedItems.map((item) => ({ symbol: item.symbol, assetType: item.assetType }))
        );

        // Map market data to rows
        const updatedRows = marketData.map((data) => ({
          symbol: data.symbol,
          assetType: data.assetType,
          price: data.price,
          priceChange: data.change,
          percentChange: data.percentChange,
          high: data.high,
          low: data.low,
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

  const fetchData = async (row: MarketWatchlistRow): Promise<MarketWatchlistRow> => {
    if (!accountId) {
      alert('Account ID is required to confirm holdings categories.');
      return Promise.reject(new Error('Account ID is required'));
    }

    if (!row.symbol || !row.assetType) {
      throw new Error('Symbol and Asset Type are required');
    }

    try {
      const data = await fetchWatchlistMarketData(accountId, [{ symbol: row.symbol, assetType: row.assetType }]);
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
        rows={rows} // Pass rows to the table
        setRows={setRows} // Allow table to update rows
      />
    </div>
  );
};

export default MarketWatchlist;