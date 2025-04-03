import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import './Balance.css';

const Balance: React.FC = () => {
  return (
    <div className="balance-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Balance</h1>
      <p>This is the balance page.</p>
    </div>
  );
};

export default Balance;