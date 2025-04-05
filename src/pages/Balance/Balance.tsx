import React, { useState } from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import BalanceOverviewTable from 'components/BalanceTable/BalanceOverviewTable';
import UploadBalanceTable from 'components/BalanceTable/UploadBalanceTable';
import './Balance.css';

interface Transaction {
  date: string;
  assetName: string;
  credit: number;
  debit: number;
  totalBalanceBefore: number;
  totalBalanceAfter: number;
  unit: string;
}

const Balance: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Handle adding transactions from UploadBalanceTable
  const handleAddTransactions = (newTransactions: Transaction[]) => {
    setTransactions((prevTransactions) => [...prevTransactions, ...newTransactions]);
  };

  return (
    <div className="balance-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <div className="balance-content">
        <div className="balance-overview">
          <BalanceOverviewTable transactions={transactions} />
        </div>
        <div className="upload-balance">
          <UploadBalanceTable />
        </div>
      </div>
    </div>
  );
};

export default Balance;