import React, { useState } from 'react';
import PageTopBar from '../../components/Bar/PageTopBar';
import { SubscriptionPlanType } from '../../types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../services/subscriptionDetailsService';
import './BasePage.css';

interface BasePageProps {
  children: React.ReactNode;
}

const BasePage: React.FC<BasePageProps> = ({ children }) => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlanType>('FREE');

  const handleAccountChange = async (newAccountId: string) => {
    setAccountId(newAccountId);
    try {
      const response = await fetchSubscriptionDetails(newAccountId);
      const planName = response.plan.name.toUpperCase() as SubscriptionPlanType;
      console.log('[BasePage] Setting subscription plan:', planName);
      setSubscriptionPlan(planName);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      setSubscriptionPlan('FREE');
    }
  };

  if (!accountId) {
    return (
      <div className="base-page">
        <PageTopBar onAccountChange={handleAccountChange} />
        <div className="base-page-content">
          <div className="base-page-message">
            <h2>Welcome to FinTrack</h2>
            <p>Please select an account to continue.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="base-page">
      <PageTopBar onAccountChange={handleAccountChange} />
      <div className="base-page-content">
        {React.cloneElement(children as React.ReactElement, { accountId, subscriptionPlan })}
      </div>
    </div>
  );
};

export default BasePage;