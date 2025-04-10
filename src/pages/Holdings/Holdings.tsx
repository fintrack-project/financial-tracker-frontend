import React, { useState } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from 'components/NavigationBar/MainNavigationBar';
import HoldingsTable from '../../components/HoldingsTable/HoldingsTable'; // Import the HoldingsTable componen
import './Holdings.css'; // Import the CSS file

const Holdings: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  return (
    <div className="holdings-container">
      <MainNavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <div className="content">
        <h1>Holdings</h1>
        <HoldingsTable accountId={accountId}/>
      </div>
    </div>
  );
};

export default Holdings;