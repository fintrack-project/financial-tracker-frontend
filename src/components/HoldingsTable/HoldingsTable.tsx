import React, { useEffect, useState } from 'react';
import { fetchHoldings } from '../../services/holdingsService';
import { Holding } from '../../types/Holding';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
}

interface MarketDataProps {
  id: number;
  symbol: string;
  price: number;
  percentChange: number;
  timestamp: string;
  assetName: string;
  priceUnit: string;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ accountId }) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [marketData, setMarketData] = useState<MarketDataProps[]>([]);

  useEffect(() => {
    if (!accountId) {
      console.warn('Account ID is null, skipping fetch'); // Debug log
      return;
    }

    const loadHoldingsAndMarketData = async () => {
      try {
        // Fetch holdings from the backend
        const fetchedHoldings = await fetchHoldings(accountId);
        setHoldings(fetchedHoldings);

        // Extract asset names from holdings
        const assetNames = fetchedHoldings.map((holding) => holding.assetName);

        // Send asset names to the backend to initiate market data updates
        const updateResponse = await fetch('/api/market-data/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assetNames),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update market data');
        }

        console.log('Market data update request sent successfully.');

        // Fetch the updated market data
        const queryParams = assetNames.map((name) => `assetNames=${encodeURIComponent(name)}`).join('&');
        const fetchResponse = await fetch(`/api/market-data/fetch?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!fetchResponse.ok) {
          throw new Error('Failed to fetch market data');
        }

        const marketDataResponse: MarketDataProps[] = await fetchResponse.json();
        setMarketData(marketDataResponse);

        console.log('Market data fetched successfully:', marketDataResponse);
      } catch (error) {
        console.error('Error loading holdings:', error);
      }
    };

    loadHoldingsAndMarketData();
  }, [accountId]);

  return (
    <div className="holdings-table-container">
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Asset Unit</th>
            <th>Price</th>
            <th>Price Unit</th>
            <th>Total Value</th>
            <th>Value Unit</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => {
              const assetData = marketData.find(
                (data) => data.assetName === holding.assetName
              );

              const totalValue = assetData
                ? parseFloat((assetData.price * holding.totalBalance).toFixed(2)).toLocaleString()
                : 'Loading...';

              return (
                <tr key={index}>
                  <td>{holding.assetName}</td>
                  <td>{holding.totalBalance.toLocaleString()}</td>
                  <td>{holding.unit}</td>
                  <td>{assetData?.price?.toLocaleString() || 'Loading...'}</td>
                  <td>{assetData?.priceUnit || 'Loading...'}</td>
                  <td>{totalValue}</td>
                  <td>{assetData?.priceUnit || 'Loading...'}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;