import React from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="holdings-table-container">
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Asset Unit</th>
            <th>Price (USD)</th>
            <th>Total Value (USD)</th>
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
                  <td>{totalValue}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;