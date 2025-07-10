import React from 'react';
import HoldingsTable from '../../../features/finance/components/HoldingsTable/HoldingsTable';
import ForexWatchlist from '../../../features/market/components/Watchlist/ForexWatchlist';
import MarketWatchlist from '../../../features/market/components/Watchlist/MarketWatchlist';
import MarketIndexWidget from '../../../features/market/components/Market/MarketIndexWidget';
import { SubscriptionPlanType } from '../../../features/subscription/types/SubscriptionPlan';
import './Dashboard.css'; // Import the CSS file

interface DashboardProps {
  accountId: string | null; // Receive accountId as a prop
  subscriptionPlan?: SubscriptionPlanType;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  accountId,
  subscriptionPlan = 'FREE'
}) => {
  console.log('[Dashboard] Current subscription plan:', subscriptionPlan);
  
  // Define the market indices we want to display
  const marketIndices = ['^GSPC', '^NDX', '^DJI', '^RUT', 'GC=F', 'SI=F', 'CL=F'];

  return (
    <div className="dashboard-container">
      <h1 className="fintrack-section-title">Dashboard</h1>
      <MarketIndexWidget 
        symbols={marketIndices} 
        subscriptionPlan={subscriptionPlan}
      />
      <HoldingsTable
        accountId={accountId}
      />
      <MarketWatchlist 
        accountId={accountId}
        subscriptionPlan={subscriptionPlan}
      />
      <ForexWatchlist 
        accountId={accountId}
        subscriptionPlan={subscriptionPlan}
      />
    </div>
  );
};

export default Dashboard;