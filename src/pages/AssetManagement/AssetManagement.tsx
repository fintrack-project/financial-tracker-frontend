import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import { Link } from 'react-router-dom';
import './AssetManagement.css'; // Import the CSS file

const AssetManagement: React.FC = () => {
  return (
    <div className='asset-management-container'>
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Asset Management Page</h1>
      <p>Here you can manage your assets.</p>
      <p>Use the navigation menu to access different sections of the application.</p>
      <Link to="/">
        <button>Go back to Dashboard</button>
      </Link>
    </div>
  )
};

export default AssetManagement;