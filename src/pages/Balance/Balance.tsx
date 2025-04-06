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
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  return (
    <div className="balance-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <div className="balance-content">
        <div className="balance-overview">
          <BalanceOverviewTable accountId={accountId} />
        </div>
        <div className="upload-balance">
          <UploadBalanceTable />
        </div>
      </div>
    </div>
  );
};

export default Balance;