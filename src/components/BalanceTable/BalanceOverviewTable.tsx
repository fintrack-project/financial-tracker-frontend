import React, { useState, useEffect } from 'react';
import { exportToCSV, exportToXLSX } from '../../services/fileService';
import { fetchTransactions } from 'services/transactionService';
import TransactionTable from '../BalanceTable/TransactionTable';
import FileActions from '../FileActions/FileActions';
import { Transaction } from 'types/Transaction';
import { OverviewTransaction } from 'types/OverviewTransaction';
import './BalanceOverviewTable.css';

interface BalanceOverviewTableProps {
  accountId: string | null;
}

const BalanceOverviewTable: React.FC<BalanceOverviewTableProps> = ({ accountId }) => {
  const [overviewTransactions, setOverviewTransactions] = useState<OverviewTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileFormat, setFileFormat] = useState<'xlsx' | 'csv'>('csv'); // Default format is .xlsx

  // Helper function to convert Transaction[] to OverviewTransaction[]
  const convertToOverviewTransactions = (
    transactions: Transaction[],
  ): OverviewTransaction[] => {
    return transactions.map((transaction) => {
      return {
        ...transaction,
        totalBalanceBefore: 0,
        totalBalanceAfter: 0
      };
    });
  };

  // Fetch transactions from the backend
  useEffect(() => {
    if (!accountId) {
      console.warn('Account ID is null, skipping fetch'); // Debug log
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching transactions for account:', accountId); // Debug log
        const data = await fetchTransactions(accountId);
        console.log('Fetched transactions:', data); // Debug log
        const overviewTransactions = convertToOverviewTransactions(data);
        setOverviewTransactions(overviewTransactions);
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
    if (overviewTransactions.length === 0) {
      alert('No data available to download.');
      return;
    }

    if (fileFormat === 'csv') {
      exportToCSV(overviewTransactions, 'balance_overview.csv');
    } else if (fileFormat === 'xlsx') {
      exportToXLSX(overviewTransactions, 'balance_overview.xlsx');
    }
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="balance-overview-container">
      <h2>Balance Overview</h2>
        <FileActions
            actionName='Download Balance Overview'
            fileFormat={fileFormat}
            onFileFormatChange={setFileFormat}
            onDownload={handleFileDownload}
        />
        <TransactionTable 
          transactions={overviewTransactions}
        />
    </div>
  );
};

export default BalanceOverviewTable;