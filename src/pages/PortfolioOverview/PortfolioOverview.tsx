import React, { useState, useEffect } from 'react';
import PageTopBar from '../../components/Bar/PageTopBar';
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
      <PageTopBar onAccountChange={handleAccountChange} /> 
      <div className='portfolio-overview-list'>
        <h1>Portfolio Overview</h1>
        <PortfolioCombinedBarChart accountId={accountId} />
        <PortfolioPieChart accountId={accountId} />
      </div>
    </div>
  );
};

export default PortfolioOverview;