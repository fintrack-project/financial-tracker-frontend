import React from 'react';
import { useHoldingsData } from '../../../hooks/useHoldingsData';
import { useBaseCurrency } from '../../../hooks/useBaseCurrency';
import { formatNumber } from '../../../utils/FormatNumber';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ accountId }) => {
  const { holdings, portfolioData, loading } = useHoldingsData(accountId);
  const { baseCurrency, usdToBaseCurrencyRate, loading: baseCurrencyLoading, error: baseCurrencyError } = useBaseCurrency(accountId);
  
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
            <th>Price ({baseCurrency || 'N/A'})</th>
            <th>Total Value ({baseCurrency || 'N/A'})</th>
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
            portfolioData.map((holding, index) => (
              <tr key={index}>
                <td>{holding.assetName}</td>
                <td>{holding.symbol}</td>
                <td>{formatNumber(holding.quantity)}</td>
                <td>{holding.assetType}</td>
                <td>{formatNumber(holding.priceInBaseCurrency)}</td>
                <td>{formatNumber(holding.totalValueInBaseCurrency)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;