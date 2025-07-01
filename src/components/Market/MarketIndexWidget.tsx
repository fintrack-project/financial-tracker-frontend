import React, { useState } from 'react';
import { fetchMarketIndices } from '../../services/marketIndexService';
import { MarketIndexData } from '../../shared/types/MarketData';
import { useRefreshCycle } from '../../shared/hooks/useRefreshCycle';
import { SubscriptionPlanType } from '../../features/subscription/types/SubscriptionPlan';
import './MarketIndexWidget.css';

interface MarketIndexWidgetProps {
  symbols: string[];
  subscriptionPlan: SubscriptionPlanType;
}

const MarketIndexWidget: React.FC<MarketIndexWidgetProps> = ({
  symbols = ['^GSPC', '^NDX', '^DJI', '^RUT', 'GC=F', 'SI=F', 'CL=F'],
  subscriptionPlan = 'FREE'
}) => {
  const [indices, setIndices] = useState<MarketIndexData[]>([]);

  const { loading, error, lastUpdated } = useRefreshCycle({
    subscriptionPlan,
    onRefresh: async () => {
      const data = await fetchMarketIndices(symbols);
      setIndices(data);
    }
  });

  // Helper function to format percentage
  const formatPercent = (value: number | string): string => {
    if (typeof value === 'string') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return 'N/A';
      return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Helper function to format price change
  const formatPriceChange = (value: number | string): string => {
    if (typeof value === 'string') {
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
        </div>
      </div>
    );
  }

  return (
    <div className="market-index-widget">
      <div className="market-widget-header">
        <h3>Market Indices</h3>
        {lastUpdated && (
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
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
              <div className={`index-change ${getChangeClass(index.priceChange)}`}>
                {formatPriceChange(index.priceChange)} ({formatPercent(index.percentChange)})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketIndexWidget; 