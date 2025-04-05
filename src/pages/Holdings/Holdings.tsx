import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import HoldingsTable from '../../components/HoldingsTable/HoldingsTable'; // Import the HoldingsTable componen
import './Holdings.css'; // Import the CSS file

const Holdings: React.FC = () => {
  return (
    <div className="holdings-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <div className="content">
        <h1>Holdings</h1>
        <HoldingsTable />
      </div>
    </div>
  );
};

export default Holdings;