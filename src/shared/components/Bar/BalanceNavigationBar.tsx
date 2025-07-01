import React from 'react';
import './BalanceNavigationBar.css';

interface BalanceNavigationBarProps {
  activeTab: 'overview' | 'edit';
  onTabChange: (tab: 'overview' | 'edit') => void;
}

const BalanceNavigationBar: React.FC<BalanceNavigationBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="balance-navigation-bar">
      <div
        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => onTabChange('overview')}
      >
        Balance Overview
      </div>
      <div
        className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
        onClick={() => onTabChange('edit')}
      >
        Balance Edit
      </div>
    </div>
  );
};

export default BalanceNavigationBar;