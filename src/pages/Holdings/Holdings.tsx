import React, { useState } from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
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
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <div className="content">
        <h1>Holdings</h1>
        <HoldingsTable />
      </div>
    </div>
  );
};

export default Holdings;