import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import HoldingsTable from 'components/HoldingsTable/HoldingsTable';
import './AssetManagement.css'; // Import the CSS file

const AssetManagement: React.FC = () => {

  return (
    <div className="asset-management-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Asset Management</h1>
      <div className="content">
        <div className="left-section">
          <h2>Balance</h2>
        </div>
        <div className="right-section">
          <h2>Assets</h2>

        </div>
      </div>
    </div>
  );
};

export default AssetManagement;