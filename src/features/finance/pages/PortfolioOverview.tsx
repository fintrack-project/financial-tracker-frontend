import React from 'react';
import PortfolioPieChart from '../components/Chart/PortfolioPieChart';
import PortfolioCombinedBarChart from '../components/Chart/PortfolioCombinedBarChart';
import './PortfolioOverview.css'; // Import the CSS file

interface PortfolioOverviewProps {
  accountId: string | null; // Receive accountId as a prop
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ accountId }) => {
  if (!accountId) {
    return (
      <div className="portfolio-overview-container">
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-overview-container">
      <h1 className="fintrack-section-title">Portfolio Overview</h1>
      <div className="charts-grid">
        <PortfolioCombinedBarChart accountId={accountId} />
        <PortfolioPieChart accountId={accountId} />
      </div>
    </div>
  );
};

export default PortfolioOverview;