import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

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
        to="/balance"
        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
      >
        Balance
      </NavLink>
      <NavLink
        to="/assetmanagement"
        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
      >
        Asset Management
      </NavLink>
      <NavLink
        to="/holdings"
        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
      >
        Holdings
      </NavLink>
    </nav>
  );
};

export default NavigationBar;