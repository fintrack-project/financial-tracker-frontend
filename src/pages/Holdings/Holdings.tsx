import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import './Holdings.css'; // Import the CSS file

const Holdings: React.FC = () => {
  return (
    <div className="holdings-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Holdings Page</h1>
      <p>This is a placeholder for the holdings page.</p>
    </div>
  );
};

export default Holdings;