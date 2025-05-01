import React from 'react';
import MainNavigationBar from '../../components/Bar/MainNavigationBar';
import AccountMenu from '../../components/Menu/AccountMenu';
import FinTrackLogo from '../../assets/logo/FinTrackLogo.png'; // Adjust the path as necessary
import './PageTopBar.css';

interface PageTopBarProps {
  onAccountChange: (accountId: string) => void;
}

const PageTopBar: React.FC<PageTopBarProps> = ({ onAccountChange }) => {
  return (
    <div className="page-top-bar">
      <div className="logo-container">
        <img src={FinTrackLogo} alt="FinTrack Logo" className="fintrack-logo" />
      </div>
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