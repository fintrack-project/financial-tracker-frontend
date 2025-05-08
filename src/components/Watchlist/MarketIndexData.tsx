import React from 'react';
import { formatNumber } from '../../utils/FormatNumber';
import './MarketIndexData.css'; // Add styles for the component

interface MarketIndexDataProps {
  indexName: string; // Name of the index (e.g., "S&P 500")
  marketData: {
    price: number;
    percent_change: number;
    price_change: number;
    price_high: number;
    price_low: number;
  } | null;
}

const MarketIndexData: React.FC<MarketIndexDataProps> = ({ indexName, marketData }) => {
  if (!marketData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="market-item">
      <h3 className="fintrack-card-title">{indexName}</h3>
      <p>Index: {formatNumber(marketData.price)}</p>
      <p>
        Change: <span className={`change ${marketData.price_change >= 0 ? 'positive' : 'negative'}`}>
          {formatNumber(marketData.price_change)}
        </span>
      </p>
      <p>
        Change (%): <span className={`change ${marketData.percent_change >= 0 ? 'positive' : 'negative'}`}>
          {formatNumber(marketData.percent_change)}%
        </span>
      </p>
      <p>Highest: {formatNumber(marketData.price_high)}</p>
      <p>Lowest: {formatNumber(marketData.price_low)}</p>
    </div>
  );
};

export default MarketIndexData;