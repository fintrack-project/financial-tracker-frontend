import React, { useState } from 'react';
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
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx'); // Default format is .xlsx
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility state
  
  // Handle file download
  const handleFileDownload = () => {
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
        <button onClick={handleFileDownload}>Download Balance Overview</button>
        <div className="dropdown-container">
          <div
            className="dropdown-selector"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
          .{format.toLowerCase()} ▼
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => {
                  setFormat('xlsx');
                  setDropdownOpen(false);
                }}
              >
                .xlsx
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  setFormat('csv');
                  setDropdownOpen(false);
                }}
              >
                .csv
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceOverviewTable;