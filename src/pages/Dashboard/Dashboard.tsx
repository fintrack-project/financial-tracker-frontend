import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard Page</h1>
      <p>Welcome to the dashboard!</p>
      <p>Here you can manage your assets and view statistics.</p>
      <p>Use the navigation menu to access different sections of the application.</p>
      <Link to="/assets">
        <button>Go to Asset Management</button>
      </Link>
    </div>
  )
};

export default Dashboard;