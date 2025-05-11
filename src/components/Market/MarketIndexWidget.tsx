import React, { useState, useEffect } from 'react';
import { fetchMarketIndices, MARKET_INDEX_NAMES } from '../../services/marketIndexService';
import { MarketIndexData } from '../../types/MarketDataProps';
import './MarketIndexWidget.css';

interface MarketIndexWidgetProps {
  symbols?: string[];
  refreshInterval?: number; // in milliseconds
}

const MarketIndexWidget: React.FC<MarketIndexWidgetProps> = ({
  symbols = ['^GSPC', '^NDX', '^DJI', '^RUT', 'GC=F', 'SI=F', 'CL=F'],
  refreshInterval = 86400000 // 24 hours default
}) => {
  const [indices, setIndices] = useState<MarketIndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMarketIndices(symbols);
      setIndices(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load market data');
      console.error('Market index widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Set up interval for periodic refresh
    const interval = setInterval(fetchData, refreshInterval);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [symbols, refreshInterval]);

  // Helper function to format percentage
  const formatPercent = (value: number | string): string => {
    if (typeof value === 'string') {
      // Try to parse the string value if possible
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return 'N/A';
      return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Helper function to format price change
  const formatPriceChange = (value: number | string): string => {
    if (typeof value === 'string') {
      // Try to parse the string value if possible
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return 'N/A';
      return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}`;
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
  };

  // Helper to determine CSS class based on change direction
  const getChangeClass = (change: number | string): string => {
    if (typeof change === 'string') {
      const numChange = parseFloat(change);
      if (isNaN(numChange)) return '';
      return numChange >= 0 ? 'positive-change' : 'negative-change';
    }
    return change >= 0 ? 'positive-change' : 'negative-change';
  };

  // Display loading state if first load
  if (loading && indices.length === 0) {
    return (
      <div className="market-index-widget">
        <div className="market-widget-header">
          <h3>Market Indices</h3>
        </div>
        <div className="market-widget-loading">
          <div className="loading-spinner"></div>
          <p>Loading market data...</p>
        </div>
      </div>
    );
  }

  // Display error state if error occurred
  if (error && indices.length === 0) {
    return (
      <div className="market-index-widget">
        <div className="market-widget-header">
          <h3>Market Indices</h3>
        </div>
        <div className="market-widget-error">
          <p>{error}</p>
          <button onClick={fetchData} className="refresh-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="market-index-widget">
      <div className="market-widget-header">
        <h3>Market Indices</h3>
        <div className="market-widget-actions">
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchData} className="refresh-button" disabled={loading}>
            {loading ? "Refreshing..." : "↻"}
          </button>
        </div>
      </div>
      
      <div className="market-index-list">
        {indices.map((index) => (
          <div key={index.symbol} className="market-index-item">
            <div className="index-info">
              <div className="index-name">{index.name}</div>
              <div className="index-symbol">{index.symbol}</div>
            </div>
            <div className="index-data">
              <div className="index-price">
                {typeof index.price === 'string' ? index.price : index.price.toFixed(2)}
              </div>
              <div className={`index-change ${getChangeClass(index.price_change)}`}>
                {formatPriceChange(index.price_change)} ({formatPercent(index.percent_change)})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketIndexWidget; 