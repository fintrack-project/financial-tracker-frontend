import React from 'react';
import { exportToCSV, exportToXLSX } from '../../services/fileService';
import TransactionTable from '../BalanceTable/TransactionTable';
import './BalanceOverviewTable.css';

interface Transaction {
  date: string;
  assetName: string;
  credit: number;
  debit: number;
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  unit: string;
}

interface BalanceOverviewTableProps {
  transactions: Transaction[];
}

const BalanceOverviewTable: React.FC<BalanceOverviewTableProps> = ({ transactions }) => {
  // Handle file download
  const handleFileDownload = (format: 'csv' | 'xlsx') => {
    if (transactions.length === 0) {
      alert('No data available to download.');
      return;
    }

    if (format === 'csv') {
      exportToCSV(transactions, 'balance_overview.csv');
    } else if (format === 'xlsx') {
      exportToXLSX(transactions, 'balance_overview.xlsx');
    }
  };

  return (
    <div className="balance-overview-container">
      <h2>Balance Overview</h2>
      {transactions.length > 0 ? (
        <TransactionTable transactions={transactions} />
      ) : (
        <p>No transactions available to display.</p>
      )}
      <div className="file-actions">
        <button onClick={() => handleFileDownload('csv')}>Download CSV</button>
        <button onClick={() => handleFileDownload('xlsx')}>Download XLSX</button>
      </div>
    </div>
  );
};

export default BalanceOverviewTable;