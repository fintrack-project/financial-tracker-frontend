import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { exportToCSV, exportToXLSX } from '../../services/fileService';
import { fetchTransactions } from 'services/transactionService';
import TransactionTable from '../BalanceTable/TransactionTable';
import { Transaction } from 'types/Transaction';
import { OverviewTransaction } from 'types/OverviewTransaction';
import './BalanceOverviewTable.css';

interface BalanceOverviewTableProps {
  accountId: string | null;
}

const BalanceOverviewTable: React.FC<BalanceOverviewTableProps> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [processedTransactions, setProcessedTransactions] = useState<OverviewTransaction[]>([]);
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

  // Calculate processedTransactions whenever transactions change
  useEffect(() => {
    const calculatedTransactions: OverviewTransaction[] = transactions.map(
      ({ transactionId, accountId, date, credit, debit, ...rest }) => {
        const totalBalanceBefore = 0;
        const totalBalanceAfter = 0;

        return {
          date: format(new Date(date), 'yyyy-MM-dd'), // Format the date as YYYY-MM-DD
          totalBalanceBefore,
          totalBalanceAfter,
          credit,
          debit,
          ...rest, // Include other fields like assetName, symbol, unit
        };
      }
    );
    setProcessedTransactions(calculatedTransactions);
  }, [transactions]);

  // Handle file download
  const handleFileDownload = () => {
    if (processedTransactions.length === 0) {
      alert('No data available to download.');
      return;
    }

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
        <TransactionTable 
          transactions={processedTransactions} 
        />
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