import React, { useState } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import './Dashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <h1>Dashboard Page</h1>
      <p>Welcome to the dashboard!</p>
      <p>Here you can manage your assets and view statistics.</p>
    </div>
  )
};

export default Dashboard;