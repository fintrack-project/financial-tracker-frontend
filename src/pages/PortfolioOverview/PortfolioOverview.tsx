import React from 'react';
import PortfolioPieChart from '../../components/Chart/PortfolioPieChart';
import PortfolioCombinedBarChart from '../../components/Chart/PortfolioCombinedBarChart';
import './PortfolioOverview.css'; // Import the CSS file

interface PortfolioOverviewProps {
  accountId: string | null; // Receive accountId as a prop
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ accountId }) => {
  return (
    <div className="portfolio-overview-container">
      <div className='portfolio-overview-list'>
        <h1>Portfolio Overview</h1>
        <PortfolioCombinedBarChart accountId={accountId} />
        <PortfolioPieChart accountId={accountId} />
      </div>
    </div>
  );
};

export default PortfolioOverview;