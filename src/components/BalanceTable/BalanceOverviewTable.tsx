import React, { useState, useEffect } from 'react';
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
  accountId: string | null;
}

const BalanceOverviewTable: React.FC<BalanceOverviewTableProps> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx'); // Default format is .xlsx
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility state

  // Fetch transactions from the backend
  useEffect(() => {
    if (!accountId) {
      console.warn('Account ID is null, skipping fetch'); // Debug log
      return;
    }
    
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/accounts/${accountId}/transactions`);
        console.log('Fetched transactions:', response); // Debug log
        console.log('Account ID received in BalanceOverviewTable:', accountId); // Debug log
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId]);
  
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

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="balance-overview-container">
      <h2>Balance Overview</h2>
        <TransactionTable transactions={transactions} />
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