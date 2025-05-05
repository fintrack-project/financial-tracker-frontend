import React from 'react';
import './AccountTier.css'; // Import styles for the component

interface AccountTierProps {
  tier: 'free' | 'premium'; // Define the allowed tiers
}

const AccountTier: React.FC<AccountTierProps> = ({ tier }) => {
  // Capitalize the first letter
  const displayTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  
  return (
    <div className={`account-tier ${tier.toLowerCase()}`}>
      {displayTier}
    </div>
  );
};

export default AccountTier;