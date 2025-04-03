import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import './AssetManagement.css'; // Import the CSS file

const AssetManagement: React.FC = () => {
  return (
    <div className='asset-management-container'>
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Asset Management Page</h1>
      <p>Here you can manage your assets.</p>
    </div>
  )
};

export default AssetManagement;