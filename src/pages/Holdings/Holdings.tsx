import React from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';

const Holdings: React.FC = () => {
  return (
    <div className="holdings-container">
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Holdings Page</h1>
      <p>This is a placeholder for the holdings page.</p>
    </div>
  );
};

export default Holdings;