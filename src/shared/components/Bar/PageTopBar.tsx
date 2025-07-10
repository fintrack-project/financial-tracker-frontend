import React from 'react';
import { NavLink } from 'react-router-dom';
import MainNavigationBar from '../../components/Bar/MainNavigationBar';
import AccountMenu from '../../components/Menu/AccountMenu';
import FinTrackLogo from '../../../assets/logo/FinTrackLogo.png'; // Adjust the path as necessary
import './PageTopBar.css';

interface PageTopBarProps {
  onAccountChange: (accountId: string) => void;
}

const PageTopBar: React.FC<PageTopBarProps> = ({ onAccountChange }) => {
  return (
    <div className="page-top-bar">
      {/* Mobile: Header row with logo and account menu */}
      <div className="page-top-bar-mobile-header">
        <div className="logo-container">
          <NavLink to="/platform/dashboard">
            <img src={FinTrackLogo} alt="FinTrack Logo" className="fintrack-logo" />
          </NavLink>
        </div>
        <div className="account-menu">
          <AccountMenu onAccountChange={onAccountChange} />
        </div>
      </div>

      {/* Desktop/Tablet: Traditional single-line layout */}
      <div className="logo-container">
        <NavLink to="/platform/dashboard">
          <img src={FinTrackLogo} alt="FinTrack Logo" className="fintrack-logo" />
        </NavLink>
      </div>
      
      {/* Navigation bar - mobile will be on separate line, desktop/tablet inline */}
      <div className="navigation-bar">
        <MainNavigationBar />
      </div>
      
      {/* Account menu - mobile hidden here, desktop/tablet visible */}
      <div className="account-menu">
        <AccountMenu onAccountChange={onAccountChange} />
      </div>
    </div>
  );
};

export default PageTopBar;