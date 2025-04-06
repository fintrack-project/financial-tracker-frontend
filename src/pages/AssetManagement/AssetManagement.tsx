import React, { useState } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import HoldingsTable from 'components/HoldingsTable/HoldingsTable';
import './AssetManagement.css'; // Import the CSS file

const AssetManagement: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  return (
    <div className="asset-management-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <h1>Asset Management</h1>
      <div className="content">
        <div className="left-section">
          <h2>Balance</h2>
        </div>
        <div className="right-section">
          <h2>Assets</h2>

        </div>
      </div>
    </div>
  );
};

export default AssetManagement;