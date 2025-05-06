import React, { useEffect, useState } from 'react';
import './AccountTier.css'; // Import styles for the component
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../services/subscriptionDetailsService';

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

    switch (planDetails.name.toLowerCase()) {
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