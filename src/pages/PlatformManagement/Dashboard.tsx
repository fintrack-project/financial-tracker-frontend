import React, { useState , useEffect } from 'react';
import MarketIndexData from '../../components/Watchlist/MarketIndexData';
import HoldingsTable from '../../components/Table/HoldingsTable/HoldingsTable';
import ForexWatchlist from '../../components/Watchlist/ForexWatchlist';
import MarketWatchlist from '../../components/Watchlist/MarketWatchlist';
import MarketIndexWidget from '../../components/Market/MarketIndexWidget';
import './Dashboard.css'; // Import the CSS file

interface DashboardProps {
  accountId: string | null; // Receive accountId as a prop
}

const Dashboard: React.FC<DashboardProps> = ({ accountId }) => {
  // Define the market indices we want to display
  const marketIndices = ['^GSPC', '^NDX', '^DJI', '^RUT', 'GC=F', 'SI=F', 'CL=F'];

  return (
    <div className="dashboard-container">
      <h1 className="fintrack-section-title">Dashboard</h1>
      
      {/* Market Indices Widget */}
      <MarketIndexWidget symbols={marketIndices} refreshInterval={60000} />
      
      <div className="dashboard-data-container">
        <div className="holdings-section">
          <h2 className="fintrack-card-title">My Holdings</h2>
          <HoldingsTable 
            accountId={accountId}
          />
        </div>
        <div className="watchlist">
          <h2 className="fintrack-card-title">Watchlist</h2>
          <MarketWatchlist 
            accountId={accountId}
          />
        </div>
        <div className="live-price">
          <h2 className="fintrack-card-title">Currency</h2>
            <ForexWatchlist 
              accountId={accountId}
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;