import React, { useState } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from 'components/NavigationBar/MainNavigationBar';
import HoldingsTable from '../../components/HoldingsTable/HoldingsTable'; // Import the HoldingsTable componen
import './Holdings.css'; // Import the CSS file
import EditableHoldingsTable from 'components/HoldingsTable/EditableHoldingsTable';
import CategoriesTable from 'components/Category/CategoriesTable';

const Holdings: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  return (
    <div className="holdings-container">
      <div className="top-bar">
        <div className="navigation-bar">
          <MainNavigationBar />
        </div>
        <div className="account-menu">
          <AccountMenu onAccountChange={handleAccountChange} />
        </div>
      </div>
      <div className="holdings-list">
        <h1>Holdings</h1>
        <EditableHoldingsTable accountId={accountId}/>
        <h1>Categories</h1>
        <CategoriesTable />
      </div>
    </div>
  );
};

export default Holdings;