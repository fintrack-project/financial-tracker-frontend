import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { fetchUserSubscription, upgradeSubscription } from '../../services/userSubscriptionService';
import { fetchPaymentMethods, getDefaultPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, confirmPayment, attachPaymentMethod } from '../../services/paymentMethodService';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { PaymentMethod, PaymentError } from '../../types/PaymentMethods';
import { formatDate } from '../../utils/FormatDate';
import AccountTier from './AccountTier';
import './Subscription.css';
import SubscriptionTabs from '../Bar/SubscriptionTabs';
import PaymentMethods from '../Bar/PaymentMethods';
import Plans from '../Bar/Plans';

interface SubscriptionProps {
  accountId: string;
}

const Subscription: React.FC<SubscriptionProps> = ({ accountId }) => {

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentMethod, setDefaultPaymentMethodState] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'payment'>('overview');

  const loadData = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserDetails(accountId);
      
      let subscriptionData;
      try {
        subscriptionData = await fetchUserSubscription(accountId);

        // Only ensure isActive is set based on status
        if (subscriptionData) {
          subscriptionData = {
            ...subscriptionData,
            isActive: subscriptionData.isActive ?? (subscriptionData.status === 'active')
          };
        }
      } catch (error) {
        subscriptionData = {
          id: 0,
          accountId: accountId,
          status: 'inactive',
          isActive: false,
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: null,
          nextBillingDate: null,
          lastPaymentDate: null,
          cancelAtPeriodEnd: false,
          createdAt: new Date().toISOString()
        } as UserSubscription;
      }
      
      let methods: PaymentMethod[] = [];
      try {
        methods = await fetchPaymentMethods(accountId);
      } catch (error) {
      }
      
      let defaultMethod = null;
      try {
        defaultMethod = await getDefaultPaymentMethod(accountId);
      } catch (error) {
        console.log('⚠️ No default payment method found');
      }

      setUserDetails(userData);
      setSubscription(subscriptionData);
      setPaymentMethods(methods);
      setDefaultPaymentMethodState(defaultMethod);
      setError(null);
    } catch (err) {
      console.error('❌ Error in loadData:', err);
      setError('Failed to load subscription details. Please try again later.');
      setUserDetails(null);
      setSubscription(null);
      setPaymentMethods([]);
      setDefaultPaymentMethodState(null);
    } finally {
      setLoading(false);
      console.log('🏁 Data loading completed');
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered, loading data...');
    loadData();
  }, [accountId]);

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deletePaymentMethod(accountId, paymentMethodId);
      await loadData();
    } catch (err) {
      console.error('❌ Error deleting payment method:', err);
      setError('Failed to delete payment method. Please try again later.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(accountId, paymentMethodId);
      await loadData();
    } catch (err) {
      console.error('❌ Error setting default payment method:', err);
      setError('Failed to set default payment method. Please try again later.');
    }
  };

  const handleAttachPaymentMethod = async (accountId: string, paymentMethodId: string) => {
    console.log('🔵 Starting payment method attachment:', {
      accountId,
      paymentMethodId
    });

    try {
      // Validate required data
      if (!accountId || !paymentMethodId) {
        console.error('❌ Missing required data:', { accountId, paymentMethodId });
        throw new Error('Missing required data for payment method attachment');
      }

      await attachPaymentMethod(accountId, paymentMethodId);

      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error('❌ Error in handleAttachPaymentMethod:', error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.name === 'PaymentError') {
          const paymentError = error as PaymentError;
          console.error('💳 Payment Error:', paymentError);
          throw paymentError;
        } else if (error.message.includes('card was declined')) {
          console.error('💳 Card declined');
          throw new PaymentError('payment_error', 'Your card was declined. Please check your card details and try again.', 'card_declined');
        } else if (error.message.includes('payment method')) {
          console.error('💳 Payment method error');
          throw new PaymentError('payment_error', 'Failed to attach payment method. Please try again.', 'payment_method_error');
        } else {
          console.error('❌ Unexpected error');
          throw new PaymentError('internal_error', 'An unexpected error occurred. Please try again later.', null);
        }
      } else {
        console.error('❌ Non-Error object thrown:', error);
        throw new PaymentError('internal_error', 'An unexpected error occurred. Please try again later.', null);
      }
    }
  };

  const handlePlanSelect = async (planName: string, paymentMethodId?: string) => {
    console.log('🔵 Starting plan selection process:', {
      planName,
      paymentMethodId,
      accountId
    });

    try {
      const response = await upgradeSubscription(accountId, planName, paymentMethodId);

      // Fetch fresh subscription data
      const updatedSubscription = await fetchUserSubscription(accountId);

      // Update state with fresh data
      setSubscription(updatedSubscription);

      // Reload all data to ensure consistency
      await loadData();
    } catch (err) {
      console.error('❌ Error updating plan:', err);
      setError('Failed to update subscription plan. Please try again later.');
    }
  };

  const handlePaymentMethodAdd = async (paymentMethodId: string) => {
    try {
      // Add new payment method
      await handleAttachPaymentMethod(accountId, paymentMethodId);
      // Reload data to reflect changes
      await loadData();
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError('Failed to add payment method. Please try again later.');
    }
  };

  const handleSubscriptionComplete = async (subscriptionId: string) => {
    try {
      // Fetch fresh subscription data
      const updatedSubscription = await fetchUserSubscription(accountId);
      
      // Update state with fresh data
      setSubscription(updatedSubscription);
      
      // Reload all data to ensure consistency
      await loadData();
    } catch (err) {
      console.error('❌ Error updating subscription:', err);
      setError('Failed to update subscription. Please try again later.');
    }
  };

  const renderOverview = () => {
    if (!userDetails || !subscription) {
      return null;
    }

    return (
      <div className="subscription-overview">
        <div className="current-plan-card">
          <h3>Current Subscription</h3>
          <div className="plan-details">
            <div className="plan-name">
              <AccountTier accountId={accountId} />
            </div>
            <div className="plan-status">
              <span className={`status ${subscription.isActive ? 'active' : 'inactive'}`}>
                {subscription.isActive ? 'Active' : 'Inactive'}
              </span>
              {subscription.cancelAtPeriodEnd && (
                <span className="cancelling">(Cancelling)</span>
              )}
            </div>
            <div className="plan-dates">
              <div>
                <strong>Next Billing Date:</strong>{' '}
                {subscription.nextBillingDate 
                  ? formatDate(subscription.nextBillingDate) 
                  : 'N/A'}
              </div>
              <div>
                <strong>Last Payment:</strong>{' '}
                {subscription.lastPaymentDate 
                  ? formatDate(subscription.lastPaymentDate) 
                  : 'N/A'}
              </div>
              <div>
                <strong>Start Date:</strong>{' '}
                {subscription.subscriptionStartDate 
                  ? formatDate(subscription.subscriptionStartDate) 
                  : 'N/A'}
              </div>
              {subscription.subscriptionEndDate && (
                <div>
                  <strong>End Date:</strong>{' '}
                  {formatDate(subscription.subscriptionEndDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlans = () => {
    if (!subscription || !userDetails) {
      return null;
    }

    // Render subscription plans section
    return (
      <Plans
        userDetails={userDetails}
        subscription={subscription}
        paymentMethods={paymentMethods}
        onPlanSelect={handlePlanSelect}
        onPaymentMethodAdd={handlePaymentMethodAdd}
        onTabChange={setActiveTab}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    );
  };

  const renderPaymentMethods = () => {
    if (!userDetails) return null;

    // Render payment methods section
    return (
      <PaymentMethods
        userDetails={userDetails}
        paymentMethods={paymentMethods}
        onSetDefault={handleSetDefaultPaymentMethod}
        onDelete={handleDeletePaymentMethod}
        onAttach={handleAttachPaymentMethod}
      />
    );
  };

  if (loading) {
    return <p>Loading subscription details...</p>;
  }

  if (error) {
    return <p className="subscription-error">{error}</p>;
  }

  if (!userDetails) {
    return <p>No subscription details available.</p>;
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h2>Subscription Management</h2>
        <SubscriptionTabs 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            console.log('🔄 Tab changed to:', tab);
            setActiveTab(tab);
          }} 
        />
      </div>

      {/* Render active tab content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'plans' && renderPlans()}
      {activeTab === 'payment' && renderPaymentMethods()}
    </div>
  );
};

export default Subscription;