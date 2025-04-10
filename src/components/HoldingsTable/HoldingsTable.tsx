import React, { useEffect, useState } from 'react';
import { fetchHoldings } from '../../services/holdingsService';
import { Holding } from '../../types/Holding';
import './HoldingsTable.css';

interface HoldingsTableProps {
  accountId: string | null; // Account ID to filter holdings
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ accountId }) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    if (!accountId) {
      console.warn('Account ID is null, skipping fetch'); // Debug log
      return;
    }

    const loadHoldings = async () => {
      try {
        const fetchedHoldings = await fetchHoldings(accountId);
        setHoldings(fetchedHoldings);
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
          {holdings.map((holding, index) => (
            <tr key={index}>
              <td>{holding.assetName}</td>
              <td>{holding.totalBalance}</td>
              <td>{holding.unit}</td>
              <td>{/* Placeholder for Price */}</td>
              <td>{/* Placeholder for Total Value */}</td>
              <td>{/* Placeholder for Unit (Value) */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;