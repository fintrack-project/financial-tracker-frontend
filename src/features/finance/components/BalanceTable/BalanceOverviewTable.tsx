import React, { useState } from 'react';
import { exportToCSV, exportToXLSX } from '../../services/fileService';
import TransactionTable from './TransactionTable';
import FileActionsDropdown from '../../../../shared/components/DropDown/FileActionsDropdown';
import { OverviewTransaction } from '../../types/OverviewTransaction';
import './BalanceOverviewTable.css';

interface BalanceOverviewTableProps {
  accountId: string | null;
  transactions?: OverviewTransaction[];
  loading?: boolean;
}

const BalanceOverviewTable: React.FC<BalanceOverviewTableProps> = ({ 
  accountId, 
  transactions = [], 
  loading = false 
}) => {
  const [fileFormat, setFileFormat] = useState<'xlsx' | 'csv'>('csv'); // Default format is .xlsx

  // Use transactions passed as props instead of fetching internally

  // Handle file download
  const handleFileDownload = () => {
    if (transactions.length === 0) {
      alert('No data available to download.');
      return;
    }

    if (fileFormat === 'csv') {
      exportToCSV(transactions, 'balance_overview.csv');
    } else if (fileFormat === 'xlsx') {
      exportToXLSX(transactions, 'balance_overview.xlsx');
    }
  };

  return (
    <div className="balance-overview-container">
      <h2 className="fintrack-subsection-title">Balance Overview</h2>
      <div className="table-wrapper">
        {loading ? (
          <p className="loading-message">Loading transactions...</p>
        ) : (
          <TransactionTable 
            transactions={transactions}
          />
        )}
      </div>
      <div className="table-footer">
        <div className="actions-group">
          <FileActionsDropdown
            actionName='Download Balance Overview'
            fileFormat={fileFormat}
            onFileFormatChange={setFileFormat}
            onDownload={handleFileDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceOverviewTable;