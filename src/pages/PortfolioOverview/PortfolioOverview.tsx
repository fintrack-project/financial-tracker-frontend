import React, { useState, useEffect } from 'react';
import { useHoldingsData } from 'hooks/useHoldingsData';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from '../../components/NavigationBar/MainNavigationBar';
import PortfolioPieChart from '../../components/Chart/PortfolioPieChart';
import PortfolioCombinedBarChart from '../../components/Chart/PortfolioCombinedBarChart';
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
        <PortfolioCombinedBarChart accountId={accountId} />
        <PortfolioPieChart accountId={accountId} />
      </div>
    </div>
  );
};

export default PortfolioOverview;