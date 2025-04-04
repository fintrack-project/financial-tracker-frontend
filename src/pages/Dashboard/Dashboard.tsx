import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import './Dashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Dashboard Page</h1>
      <p>Welcome to the dashboard!</p>
      <p>Here you can manage your assets and view statistics.</p>
    </div>
  )
};

export default Dashboard;