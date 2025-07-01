import React, { useEffect, useState } from 'react';
import './AccountTier.css'; // Import styles for the component
import { SubscriptionPlan } from '../../features/subscription/types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../features/subscription/services/subscriptionDetailsService';

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
    if (!planDetails) return '#6c757d'; // Default gray for no plan

    switch (planDetails.id) {
      case 'plan_free':
        return '#6c757d'; // Gray
      case 'plan_basic':
      case 'plan_basic_annual':
        return '#28a745'; // Green
      case 'plan_premium':
      case 'plan_premium_annual':
        return '#007bff'; // Blue
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return <span className="account-tier" style={{ backgroundColor: '#6c757d' }}>Loading...</span>;
  }

  if (error) {
    return <span className="account-tier" style={{ backgroundColor: '#dc3545' }}>Error</span>;
  }

  return (
    <span 
      className="account-tier"
      style={{ backgroundColor: getPlanColor() }}
    >
      {planDetails ? planDetails.name : 'Free'}
    </span>
  );
};

export default AccountTier;