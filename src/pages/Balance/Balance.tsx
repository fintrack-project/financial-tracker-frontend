import React, { useState } from 'react';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import NavigationBar from 'components/NavigationBar/NavigationBar';
import BalanceTable from 'components/BalanceTable/BalanceTable';
import './Balance.css';

interface Asset {
  name: string;
  amount: number;
  unit: string;
  reason?: string;
}

const Balance: React.FC = () => {
  return (
    <div className="balance-container">
      <NavigationBar />
      <div className="top-bar">
        <AccountMenu />
      </div>
      <h1>Balance</h1>
      <div className="content">
        <BalanceTable />
      </div>
    </div>
  );
};

export default Balance;