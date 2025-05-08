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
      <h1 className="fintrack-section-title">Portfolio Overview</h1>
      <PortfolioCombinedBarChart accountId={accountId} />
      <PortfolioPieChart accountId={accountId} />
    </div>
  );
};

export default PortfolioOverview;