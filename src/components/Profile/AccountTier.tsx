import React from 'react';
import './AccountTier.css'; // Import styles for the component

interface AccountTierProps {
  tier: 'free' | 'premium'; // Define the allowed tiers
}

const AccountTier: React.FC<AccountTierProps> = ({ tier }) => {
  return (
    <div className={`account-tier ${tier.toLowerCase()}`}>
      {tier}
    </div>
  );
};

export default AccountTier;