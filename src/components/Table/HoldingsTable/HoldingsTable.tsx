import React, { ReactNode } from 'react';
import { useHoldingsData } from '../../../hooks/useHoldingsData';
import { useBaseCurrency } from '../../../hooks/useBaseCurrency';
import { formatNumber } from '../../../utils/FormatNumber';
import { FaCoins } from 'react-icons/fa6';
import Icon from '../../common/Icon';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
}

interface EmptyStateProps {
  icon: ReactNode;
  text: string;
  subtext: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, text, subtext }) => (
  <div className="empty-state">
    {icon}
    <div className="empty-state-text">{text}</div>
    <div className="empty-state-subtext">{subtext}</div>
  </div>
);

const HoldingsTable: React.FC<HoldingsTableProps> = ({ accountId }) => {
  const { holdings, portfolioData, loading } = useHoldingsData(accountId);
  const { baseCurrency, loading: baseCurrencyLoading } = useBaseCurrency(accountId);
  
  if (loading || baseCurrencyLoading) {
    return (
      <div className="table-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading holdings data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container holdings-table-container">
      <div className="scrollable-content">
        <table className="data-table">
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
                <td colSpan={6}>
                  <EmptyState
                    icon={<Icon icon={FaCoins} className="empty-state-icon" aria-hidden={true} />}
                    text="No Holdings Found"
                    subtext="Add holdings to start tracking your portfolio"
                  />
                </td>
              </tr>
            ) : (
              portfolioData.map((holding, index) => (
                <tr key={index}>
                  <td>{holding.assetName}</td>
                  <td className="symbol-text">{holding.symbol}</td>
                  <td className="numeric-value">{formatNumber(holding.quantity)}</td>
                  <td>{holding.assetType}</td>
                  <td className="numeric-value">{formatNumber(holding.priceInBaseCurrency, holding.assetType === 'FOREX' ? 6 : 2)}</td>
                  <td className="numeric-value">{formatNumber(holding.totalValueInBaseCurrency)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;