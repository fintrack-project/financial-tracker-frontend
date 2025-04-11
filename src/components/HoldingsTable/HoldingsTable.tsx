import React, { useEffect, useState } from 'react';
import { fetchHoldings } from '../../services/holdingsService';
import { Holding } from '../../types/Holding';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
}

interface WebSocketMarketData {
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
  const [assetPrices, setAssetPrices] = useState<WebSocketMarketData[]>([]);

  useEffect(() => {
    if (!accountId) {
      console.warn('Account ID is null, skipping fetch'); // Debug log
      return;
    }

    const loadHoldings = async () => {
      try {
        // Fetch holdings from the backend
        const fetchedHoldings = await fetchHoldings(accountId);
        setHoldings(fetchedHoldings);

        // Extract asset names from holdings
        const assetNames = fetchedHoldings.map((holding) => holding.assetName);

        // Send asset names to the backend to initiate market data updates
        fetch('/api/market-data/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assetNames),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to send market data update request');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Market data update request sent:', data);
          })
          .catch((error) => {
            console.error('Error sending market data update request:', error);
          });

        // Establish WebSocket connection for real-time updates
        const socket = new WebSocket('ws://localhost:8080/market-data-updates');

        socket.onopen = () => {
          console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
          const updatedMarketData: WebSocketMarketData[] = JSON.parse(event.data);
          console.log('Received updated market data:', updatedMarketData);

          // Update the asset prices in the state
          setAssetPrices(updatedMarketData);
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
          console.log('WebSocket connection closed');
        };

        // Cleanup WebSocket connection on component unmount
        return () => {
          socket.close();
        };
      } catch (error) {
        console.error('Error loading holdings:', error);
      }
    };

    loadHoldings();
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
              const assetPrice = assetPrices.find(
                (price) => price.assetName === holding.assetName
              );

              const totalValue = assetPrice
                ? (assetPrice.price * holding.totalBalance).toFixed(2)
                : 'Loading...';

              return (
                <tr key={index}>
                  <td>{holding.assetName}</td>
                  <td>{holding.totalBalance}</td>
                  <td>{holding.unit}</td>
                  <td>{assetPrice?.price || 'Loading...'}</td>
                  <td>{assetPrice?.priceUnit || 'Loading...'}</td>
                  <td>{totalValue}</td>
                  <td>
                    {assetPrice?.percentChange !== undefined
                      ? `${assetPrice.percentChange}%`
                      : 'Loading...'}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;