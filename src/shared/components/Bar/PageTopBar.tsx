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
      <div className="logo-container">
        <NavLink to="/platform/dashboard">
          <img src={FinTrackLogo} alt="FinTrack Logo" className="fintrack-logo" />
        </NavLink>
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