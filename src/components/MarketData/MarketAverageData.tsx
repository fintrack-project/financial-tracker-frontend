import React from 'react';
import './MarketAverageData.css'; // Add styles for the component

interface MarketAverageDataProps {
  indexName: string; // Name of the index (e.g., "S&P 500")
  marketData: {
    price: string;
    percent_change: string;
    price_change: string;
    price_high: string;
    price_low: string;
  } | null;
}

const MarketAverageData: React.FC<MarketAverageDataProps> = ({ indexName, marketData }) => {
  if (!marketData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="market-item">
      <h2>{indexName}</h2>
      <p>Index: {parseFloat(marketData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p>
        Change: <span className={`change ${parseFloat(marketData.price_change) >= 0 ? 'positive' : 'negative'}`}>
          {parseFloat(marketData.price_change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </p>
      <p>
        Change (%): <span className={`change ${parseFloat(marketData.percent_change) >= 0 ? 'positive' : 'negative'}`}>
          {parseFloat(marketData.percent_change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
        </span>
      </p>
      <p>Highest: {parseFloat(marketData.price_high).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p>Lowest: {parseFloat(marketData.price_low).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  );
};

export default MarketAverageData;