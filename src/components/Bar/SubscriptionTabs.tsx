import React from 'react';
import './SubscriptionTabs.css';

interface SubscriptionTabsProps {
  activeTab: 'overview' | 'plans' | 'payment';
  onTabChange: (tab: 'overview' | 'plans' | 'payment') => void;
}

const SubscriptionTabs: React.FC<SubscriptionTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="subscription-tabs">
      <button
        className={activeTab === 'overview' ? 'active' : ''}
        onClick={() => onTabChange('overview')}
      >
        Overview
      </button>
      <button
        className={activeTab === 'plans' ? 'active' : ''}
        onClick={() => onTabChange('plans')}
      >
        Plans & Pricing
      </button>
      <button
        className={activeTab === 'payment' ? 'active' : ''}
        onClick={() => onTabChange('payment')}
      >
        Payment Methods
      </button>
    </div>
  );
};

export default SubscriptionTabs; 