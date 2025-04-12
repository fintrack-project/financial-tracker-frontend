import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { exportToCSV, exportToXLSX } from '../../services/fileService';
import { fetchTransactions } from 'services/transactionService';
import TransactionTable from '../BalanceTable/TransactionTable';
import { Transaction } from 'types/Transaction';
import './BalanceOverviewTable.css';

interface BalanceOverviewTableProps {
  accountId: string | null;
}

const BalanceOverviewTable: React.FC<BalanceOverviewTableProps> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileFormat, setFileFormat] = useState<'xlsx' | 'csv'>('xlsx'); // Default format is .xlsx
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility state

  // Fetch transactions from the backend
  useEffect(() => {
    if (!accountId) {
      console.warn('Account ID is null, skipping fetch'); // Debug log
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchTransactions(accountId);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);
  
  // Handle file download
  const handleFileDownload = () => {
    if (transactions.length === 0) {
      alert('No data available to download.');
      return;
    }

    // Exclude `transactionId` and `accountId` from the exported data
    const processedTransactions = transactions.map(({ transactionId, accountId, date, ...rest }) => ({
      date: format(new Date(date), 'yyyy-MM-dd'), // Format the date as YYYY-MM-DD
      ...rest,
    }));

    if (fileFormat === 'csv') {
      exportToCSV(processedTransactions, 'balance_overview.csv');
    } else if (fileFormat === 'xlsx') {
      exportToXLSX(processedTransactions, 'balance_overview.xlsx');
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
        <button className="button" onClick={handleFileDownload}>Download Balance Overview</button>
        <div className="dropdown-container">
          <div
            className="dropdown-selector"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
          .{fileFormat.toLowerCase()} ▼
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => {
                  setFileFormat('xlsx');
                  setDropdownOpen(false);
                }}
              >
                .xlsx
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  setFileFormat('csv');
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