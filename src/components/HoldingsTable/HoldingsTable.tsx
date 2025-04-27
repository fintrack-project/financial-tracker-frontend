import React from 'react';
import { useHoldingsData } from '../../hooks/useHoldingsData';
import { formatNumber } from '../../utils/FormatNumber';
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
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Asset Unit</th>
            <th>Price (USD)</th>
            <th>Total Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.length === 0 ? (
            <tr>
              <td colSpan={6} className="no-holdings-row">
                No holdings
              </td>
            </tr>
          ) : (
            holdings.map((holding, index) => {
              const assetData = marketData.find(
                (data) => data.symbol === holding.symbol
              );
              const totalValue = assetData
                ? formatNumber(assetData.price * holding.totalBalance)
                : 'Loading...';

              return (
                <tr key={index}>
                  <td>{holding.assetName}</td>
                  <td>{holding.symbol}</td>
                  <td>{formatNumber(holding.totalBalance)}</td>
                  <td>{holding.unit}</td>
                  <td>{assetData?.price ? formatNumber(assetData.price) : 'Loading...'}</td>
                  <td>{totalValue}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;