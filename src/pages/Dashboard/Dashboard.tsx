import React, { useState , useEffect } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import MainNavigationBar from '../../components/NavigationBar/MainNavigationBar';
import MarketAverageData from 'components/MarketData/MarketAverageData';
import { fetchMarketAverageData } from '../../services/marketAverageDataService';
import './Dashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID
  const [marketData, setMarketData] = useState<{ [key: string]: any } | null>(null);

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  // Fetch market data for S&P 500 and Nasdaq ETFs
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const symbols = ["^GSPC", "^NDX"];
        const encodedSymbols = symbols.map(encodeURIComponent).join(",");
        const data = await fetchMarketAverageData([encodedSymbols]);
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div className="dashboard-container">
      <MainNavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <div className="market-data-container">
        <div className="market-average">
          <h1>Market Average</h1>
          <div className="market-average-items">
            <div className="market-average-items">
              {marketData && marketData['^GSPC'] && (
                <MarketAverageData
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
                <MarketAverageData
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
        <div className="live-price">
          <h1>Live Price of Holdings/Watchlist</h1>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  )
};

export default Dashboard;