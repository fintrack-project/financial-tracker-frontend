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
            holdings.map((holding, index) => {
              // Determine the price
              const isForex = holding.assetType === 'FOREX';
              const isBaseCurrency = holding.symbol === baseCurrency;

              // Find the matching market data
              const assetData = marketData.find(
                (data) =>
                  data.symbol ===
                    (isForex ? `${holding.symbol}/${baseCurrency}` : holding.symbol) &&
                  data.assetType === holding.assetType
              );

              // Calculate the price
              const price = isBaseCurrency
                ? 1 // Base currency always has a price of 1
                : isForex
                ? assetData?.price // Do not multiply by usdToBaseCurrencyRate for FOREX
                : assetData?.price
                ? assetData.price * (usdToBaseCurrencyRate || 1) // Multiply by usdToBaseCurrencyRate for non-FOREX
                : undefined;

              // Calculate the total value
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