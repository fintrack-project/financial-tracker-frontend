import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigationBar.css';

const NavigationBar: React.FC = () => {
  return (
    <nav className="navigation-bar">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/holdings"
        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
      >
        Holdings
      </NavLink>
      <NavLink
        to="/assetmanagement"
        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
      >
        Asset Management
      </NavLink>
      <NavLink
        to="/balance"
        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
      >
        Balance
      </NavLink>
    </nav>
  );
};

export default NavigationBar;