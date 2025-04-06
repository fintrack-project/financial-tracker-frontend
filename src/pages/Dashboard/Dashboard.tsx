import React, { useState , useEffect } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { fetchMarketData } from '../../services/marketDataService';
import './Dashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID
  const [sp500Data, setSp500Data] = useState<{ price: string; change: string } | null>(null);
  const [nasdaqData, setNasdaqData] = useState<{ price: string; change: string } | null>(null);

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  // Fetch market data for S&P 500 and Nasdaq
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sp500 = await fetchMarketData('^GSPC');
        const nasdaq = await fetchMarketData('^IXIC');
        setSp500Data(sp500);
        setNasdaqData(nasdaq);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu onAccountChange={handleAccountChange} />
      </div>
      <h1>Dashboard Page</h1>
      <div className="market-data-container">
        <div className="market-average">
          <h2>Market Average</h2>
          <div className="market-item">
            <h3>S&P 500</h3>
            {sp500Data ? (
              <p>
                Price: ${sp500Data.price} <br />
                Change: {sp500Data.change}
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="market-item">
            <h3>Nasdaq</h3>
            {nasdaqData ? (
              <p>
                Price: ${nasdaqData.price} <br />
                Change: {nasdaqData.change}
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className="live-price">
          <h2>Live Price of Holdings/Watchlist</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  )
};

export default Dashboard;