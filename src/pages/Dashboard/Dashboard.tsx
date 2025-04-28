import React, { useState , useEffect } from 'react';
import MarketIndexData from '../../components/Watchlist/MarketIndexData';
import HoldingsTable from '../../components/Table/HoldingsTable/HoldingsTable';
import { fetchMarketIndexData } from '../../services/marketIndexDataService';
import ForexWatchlist from '../../components/Watchlist/ForexWatchlist';
import MarketWatchlist from '../../components/Watchlist/MarketWatchlist';
import './Dashboard.css'; // Import the CSS file

interface DashboardProps {
  accountId: string | null; // Receive accountId as a prop
}

const Dashboard: React.FC<DashboardProps> = ({ accountId }) => {
  const [marketData, setMarketData] = useState<{ [key: string]: any } | null>(null);
  
  // Fetch market data for S&P 500 and Nasdaq ETFs
  useEffect(() => {
    const symbols = ["^GSPC", "^NDX"];
    const fetchAndUpdateMarketData = async () => {
      try {
        const encodedSymbols = symbols.map(encodeURIComponent).join(",");

        // Fetch the updated market index data
        const data = await fetchMarketIndexData([encodedSymbols]);
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchAndUpdateMarketData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="market-data-container">
        <div className="market-index">
          <h1>Market Index</h1>
          <div className="market-index-items">
            <div className="market-index-items">
              {marketData && marketData['^GSPC'] && (
                <MarketIndexData
                  indexName="S&P 500"
                  marketData={{
                    price: marketData['^GSPC'].price,
                    price_change: marketData['^GSPC'].price_change,
                    percent_change: marketData['^GSPC'].percent_change,
                    price_high: marketData['^GSPC'].price_high,
                    price_low: marketData['^GSPC'].price_low,
                  }}
                />
              )}
              {marketData && marketData['^NDX'] && (
                <MarketIndexData
                  indexName="Nasdaq 100"
                  marketData={{
                    price: marketData['^NDX'].price,
                    price_change: marketData['^NDX'].price_change,
                    percent_change: marketData['^NDX'].percent_change,
                    price_high: marketData['^NDX'].price_high,
                    price_low: marketData['^NDX'].price_low,
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="holdings-section">
          <h1>My Holdings</h1>
          <HoldingsTable 
            accountId={accountId}
          />
        </div>
      </div>
      <div className="dashboard-data-container">
        <div className="watchlist">
          <h1>Watchlist</h1>
          <MarketWatchlist 
            accountId={accountId}
          />
        </div>
        <div className="live-price">
          <h1>Currency</h1>
            <ForexWatchlist 
              accountId={accountId}
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;