import React from 'react';
import MainNavigationBar from '../../components/Bar/MainNavigationBar';
import AccountMenu from '../../components/Menu/AccountMenu';
import './PageTopBar.css';

interface PageTopBarProps {
  onAccountChange: (accountId: string) => void;
}

const PageTopBar: React.FC<PageTopBarProps> = ({ onAccountChange }) => {
  return (
    <div className="page-top-bar">
      <div className="navigation-bar">
        <MainNavigationBar />
      </div>
      <div className="account-menu">
        <AccountMenu onAccountChange={onAccountChange} />
      </div>
    </div>
  );
};

export default PageTopBar;