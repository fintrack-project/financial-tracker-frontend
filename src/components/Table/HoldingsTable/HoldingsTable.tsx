import React from 'react';
import { useHoldingsData } from '../../../hooks/useHoldingsData';
import { useBaseCurrency } from '../../../hooks/useBaseCurrency';
import { formatNumber } from '../../../utils/FormatNumber';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ accountId }) => {
  const { holdings, marketData, loading } = useHoldingsData(accountId);
  const { baseCurrency, loading: baseCurrencyLoading, error: baseCurrencyError } = useBaseCurrency(accountId);
  
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
            holdings.map((holding, index) => {
              // Construct the symbol based on assetType
              const symbol =
                holding.assetType === 'FOREX' || holding.assetType === 'CRYPTO'
                  ? `${baseCurrency}/${holding.symbol}` // Use base currency for FOREX and CRYPTO
                  : holding.symbol; // Use holding symbol for other asset types

              // Find the matching market data
              const assetData = marketData.find(
                (data) => data.symbol === symbol && data.assetType === holding.assetType
              );

              const price = (holding.symbol === baseCurrency) ? 1 : (assetData?.price || undefined); // Default to 1 if baseCurrency matches holding.symbol

              const totalValue = price
                ? formatNumber(price * holding.totalBalance)
                : 'Loading...';

              return (
                <tr key={index}>
                  <td>{holding.assetName}</td>
                  <td>{holding.symbol}</td>
                  <td>{formatNumber(holding.totalBalance)}</td>
                  <td>{holding.unit}</td>
                  <td>{price ? formatNumber(price) : 'Loading...'}</td>
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