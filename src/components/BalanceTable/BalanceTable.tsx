import React from 'react';
import './BalanceTable.css';

interface Transaction {
  date: string;
  assetName: string;
  credit: number; // Increase
  debit: number; // Decrease
  totalBalance: number;
  unit: string;
}

const BalanceTable: React.FC = () => {
  // Dummy data for transaction history
  const transactions: Transaction[] = Array.from({ length: 50 }, (_, index) => ({
    date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0], // Generate past dates
    assetName: `Asset ${index + 1}`,
    credit: Math.floor(Math.random() * 1000), // Random increase
    debit: Math.floor(Math.random() * 500), // Random decrease
    totalBalance: Math.floor(Math.random() * 10000), // Random total balance
    unit: 'USD',
  }));

  return (
    <div className="balance-table-container">
      <table className="balance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset Name</th>
            <th>Credit (Increase)</th>
            <th>Debit (Decrease)</th>
            <th>Total Balance</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 30).map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td>{transaction.assetName}</td>
              <td>{transaction.credit}</td>
              <td>{transaction.debit}</td>
              <td>{transaction.totalBalance}</td>
              <td>{transaction.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceTable;