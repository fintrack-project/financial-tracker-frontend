import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Dashboard Page</h1>
      <p>Welcome to the dashboard!</p>
      <p>Here you can manage your assets and view statistics.</p>
      <p>Use the navigation menu to access different sections of the application.</p>
      <Link to="/assetmanagement">
        <button>Go to Asset Management</button>
      </Link>
    </div>
  )
};

export default Dashboard;