import React, { useState, useEffect } from 'react';
import EditableWatchlistTable from './EditableWatchlistTable';
import { fetchWatchlistData } from '../../services/watchlistDataService';
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

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!accountId) {
        setError('Account ID is required to fetch watchlist.');
        return;
      }

      try {
        // Fetch saved watchlist items
        const savedItems = await fetchWatchlistData(accountId, ['STOCK', 'CRYPTO', 'COMMODITY']);
        if (!savedItems || savedItems.length === 0) {
          setRows([]);
          return;
        }

        // Fetch market data for saved items
        const marketData = await fetchMarketData(
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

        setRows(updatedRows);
      } catch (err) {
        console.error('Error fetching market watchlist data:', err);
        setError('Failed to fetch market watchlist data. Please try again later.');
      }
    };

    fetchWatchlist();
  }, [accountId]);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <EditableWatchlistTable<MarketWatchlistRow>
        columns={columns}
        fetchData={async (row) => row} // No additional fetch needed for now
        accountId={accountId}
        rows={rows}
        setRows={setRows}
      />
    </div>
  );
};

export default MarketWatchlist;