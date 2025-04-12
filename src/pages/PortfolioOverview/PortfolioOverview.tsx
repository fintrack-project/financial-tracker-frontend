import React, { useState } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from 'components/NavigationBar/MainNavigationBar';
import './PortfolioOverview.css'; // Import the CSS file

const PortfolioOverview: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  return (
    <div className="portfolio-overview-container">
      <div className="top-bar">
        <div className="navigation-bar">
          <MainNavigationBar />
        </div>
        <div className="account-menu">
          <AccountMenu onAccountChange={handleAccountChange} />
        </div>
      </div>
      <div className='portfolio-overview-list'>
        <h1>Portfolio Overview</h1>
        <div className="content">
          <div className="left-section">
            <h2>Balance</h2>
          </div>
          <div className="right-section">
            <h2>Assets</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;