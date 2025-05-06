import React from 'react';
import './AccountTier.css'; // Import styles for the component

interface AccountTierProps {
  tier: 'free' | 'basic' | 'premium'; // Define the allowed tiers
}

const AccountTier: React.FC<AccountTierProps> = ({ tier }) => {
  const getTierColor = () => {
    switch (tier.toLowerCase()) {
      case 'free':
        return '#6c757d'; // Gray
      case 'basic':
        return '#28a745'; // Green
      case 'premium':
        return '#007bff'; // Blue
      default:
        return '#6c757d';
    }
  };

  return (
    <span 
      className="account-tier"
      style={{ backgroundColor: getTierColor() }}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
};

export default AccountTier;