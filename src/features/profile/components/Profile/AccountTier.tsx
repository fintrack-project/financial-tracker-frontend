import React, { useEffect, useState } from 'react';
import './AccountTier.css'; // Import styles for the component
import { SubscriptionPlan } from '../../../../features/subscription/types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../../../features/subscription/services/subscriptionDetailsService';

interface AccountTierProps {
  accountId: string;
}

const AccountTier: React.FC<AccountTierProps> = ({ accountId }) => {
  const [planDetails, setPlanDetails] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubscriptionDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchSubscriptionDetails(accountId);
        setPlanDetails(response.plan);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscription details:', err);
        setError('Failed to load subscription plan');
        setPlanDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      loadSubscriptionDetails();
    } else {
      setLoading(false);
    }
  }, [accountId]);

  const getPlanColor = () => {
    if (!planDetails) return 'var(--tier-free-bg)'; // Default gray for no plan

    switch (planDetails.id) {
      case 'plan_free':
        return 'var(--tier-free-bg)'; // Gray
      case 'plan_basic':
      case 'plan_basic_annual':
        return 'var(--tier-basic-bg)'; // Green
      case 'plan_premium':
      case 'plan_premium_annual':
        return 'var(--tier-premium-bg)'; // Blue (consistent with theme)
      default:
        return 'var(--tier-free-bg)';
    }
  };

  if (loading) {
    return <span className="account-tier" style={{ backgroundColor: 'var(--tier-free-bg)' }}>Loading...</span>;
  }

  if (error) {
    return <span className="account-tier" style={{ backgroundColor: 'var(--error-color)' }}>Error</span>;
  }

  const formatPlanName = (plan: SubscriptionPlan) => {
    if (plan.id === 'plan_free') {
      return 'Free';
    }
    
    // Check if the plan name already contains 'Annual' or 'Monthly'
    const nameLower = plan.name.toLowerCase();
    if (nameLower.includes('annual') || nameLower.includes('monthly')) {
      return plan.name; // Return the name as-is if it already contains billing cycle
    }
    
    // Only add billing cycle if it's not already in the name
    const billingCycle = plan.interval === 'year' ? 'Annual' : 'Monthly';
    return `${plan.name} ${billingCycle}`;
  };

  return (
    <span 
      className="account-tier"
      style={{ backgroundColor: getPlanColor() }}
    >
      {planDetails ? formatPlanName(planDetails) : 'Free'}
    </span>
  );
};

export default AccountTier;