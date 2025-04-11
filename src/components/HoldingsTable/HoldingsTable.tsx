import React, { useEffect, useState } from 'react';
import { fetchHoldings } from '../../services/holdingsService';
import { updateMarketData, fetchMarketData, MarketDataProps } from 'services/marketDataService';
import { Holding } from '../../types/Holding';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
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
        // Step 1: Fetch holdings from the backend
        const fetchedHoldings = await fetchHoldings(accountId);
        setHoldings(fetchedHoldings);

        // Step 2: Extract asset names from holdings
        const assetNames = fetchedHoldings.map((holding) => holding.assetName);

        // Step 3: Send asset names to the backend to initiate market data updates
        await updateMarketData(assetNames);

        // Step 4: Fetch the updated market data
        const marketDataResponse = await fetchMarketData(assetNames);
        setMarketData(marketDataResponse);

        console.log('Market data fetched successfully:', marketDataResponse);
      } catch (error) {
        console.error('Error loading holdings or market data:', error);
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