import React, { useState, useEffect } from 'react';
import { exportToCSV, exportToXLSX } from '../../services/fileService';
import { fetchTransactions } from 'services/transactionService';
import TransactionTable from '../BalanceTable/TransactionTable';
import FileActions from '../FileActions/FileActions';
import { Transaction } from 'types/Transaction';
import { useProcessedTransactions } from 'hooks/useProcessedTransactions';
import './BalanceOverviewTable.css';

interface BalanceOverviewTableProps {
  accountId: string | null;
}

const BalanceOverviewTable: React.FC<BalanceOverviewTableProps> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [processedTransactions, setProcessedTransactions] = useState<OverviewTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileFormat, setFileFormat] = useState<'xlsx' | 'csv'>('csv'); // Default format is .xlsx

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

  const processedTransactions = useProcessedTransactions(transactions);

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
        <FileActions
            actionName='Download Balance Overview'
            fileFormat={fileFormat}
            onFileFormatChange={setFileFormat}
            onDownload={handleFileDownload}
        />
        <TransactionTable 
          transactions={processedTransactions} 
        />
    </div>
  );
};

export default BalanceOverviewTable;