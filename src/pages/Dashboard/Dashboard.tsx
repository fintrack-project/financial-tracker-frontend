import React, { useState , useEffect } from 'react';
import AccountMenu from '../../components/Menu/AccountMenu';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { fetchMarketAverageData } from '../../services/marketAverageDataService';
import './Dashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  const [accountId, setAccountId] = useState<string | null>(null); // Store the currently logged-in account ID
  const [marketData, setMarketData] = useState<{ [key: string]: { price: string; percent_change: string } } | null>(null);

  // Callback to get the accountId from AccountMenu
  const handleAccountChange = (newAccountId: string) => {
    setAccountId(newAccountId);
  };

  // Fetch market data for S&P 500 and Nasdaq ETFs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbols = ["^GSPC", "^NDX"];
        const encodedSymbols = symbols.map(encodeURIComponent).join(",");
        const data = await fetchMarketAverageData([encodedSymbols]);
        setMarketData(data);
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
            {marketData && marketData['^GSPC'] ? (
              <p>
                Price: ${marketData['^GSPC'].price} <br />
                Change: {marketData['^GSPC'].percent_change}
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="market-item">
            <h3>Nasdaq 100</h3>
            {marketData && marketData['^NDX'] ? (
              <p>
                Price: ${marketData['^NDX'].price} <br />
                Change: {marketData['^NDX'].percent_change}
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