import React, { useState, useEffect, useCallback } from 'react';
import { fetchUserDetails } from '../../../features/auth/services/userService';
import { fetchUserSubscription, upgradeSubscription } from '../services/userSubscriptionService';
import { fetchPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod, attachPaymentMethod } from '../services/paymentMethodService';
import { UserDetails } from '../../../shared/types/UserDetails';
import { UserSubscription } from '../types/UserSubscription';
import { PaymentMethod, PaymentError } from '../../../shared/types/PaymentMethods';
import { formatDate } from '../../../shared/utils/FormatDate';
import AccountTier from '../../profile/components/Profile/AccountTier';
import './Subscription.css';
import SubscriptionTabs from './UI/SubscriptionTabs';
import PaymentMethods from './Payment/PaymentMethods';
import Plans from './Plans/Plans';

interface SubscriptionProps {
  accountId: string;
}

const Subscription: React.FC<SubscriptionProps> = ({ accountId }) => {

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'payment'>('overview');

  const loadData = useCallback(async () => {
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
          status: 'incomplete',
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
      
      setUserDetails(userData);
      setSubscription(subscriptionData);
      setPaymentMethods(methods);
      setError(null);
    } catch (err) {
      console.error('❌ Error in loadData:', err);
      setError('Failed to load subscription details. Please try again later.');
      setUserDetails(null);
      setSubscription(null);
      setPaymentMethods([]);
    } finally {
      setLoading(false);
      console.log('🏁 Data loading completed');
    }
  }, [accountId]);

  useEffect(() => {
    console.log('🔄 useEffect triggered, loading data...');
    loadData();
  }, [loadData]);

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
      await upgradeSubscription(accountId, planName, paymentMethodId);

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

  // Debug function to manually sync subscription status
  const handleManualSync = async () => {
    if (!subscription?.stripeSubscriptionId) {
      setError('No subscription ID available for sync');
      return;
    }

    try {
      setError(null);
      console.log('🔄 Manual sync requested for subscription:', subscription.stripeSubscriptionId);
      
      const response = await fetch('/api/user/subscriptions/sync-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          stripeSubscriptionId: subscription.stripeSubscriptionId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Manual sync successful:', result.data);
        setError('Sync completed successfully! Stripe: ' + result.data.stripeStatus + ', Database: ' + result.data.databaseStatus);
        
        // Reload data to show updated status
        await loadData();
      } else {
        console.error('❌ Manual sync failed:', result.message);
        setError('Sync failed: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error during manual sync:', err);
      setError('Sync failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Debug function to get subscription status
  const handleGetStatus = async () => {
    if (!subscription?.stripeSubscriptionId) {
      setError('No subscription ID available');
      return;
    }

    try {
      setError(null);
      console.log('🔍 Getting status for subscription:', subscription.stripeSubscriptionId);
      
      const response = await fetch(`/api/user/subscriptions/status/${subscription.stripeSubscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('📊 Subscription status:', result.data);
        setError('Status retrieved successfully! Check console for details.');
      } else {
        console.error('❌ Failed to get status:', result.message);
        setError('Failed to get status: ' + result.message);
      }
    } catch (err) {
      console.error('❌ Error getting status:', err);
      setError('Failed to get status: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
        
        {/* Debug section - Development only */}
        {process.env.NODE_ENV === 'development' && subscription?.stripeSubscriptionId && (
          <div className="debug-section" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
            <h4>🔧 Debug Tools (Development Only)</h4>
            <p><strong>Stripe Subscription ID:</strong> {subscription.stripeSubscriptionId}</p>
            <p><strong>Current Status:</strong> {subscription.status}</p>
            <p><strong>Is Active:</strong> {subscription.isActive ? 'Yes' : 'No'}</p>
            
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={handleManualSync}
                style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                🔄 Manual Sync
              </button>
              <button 
                onClick={handleGetStatus}
                style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                📊 Get Status
              </button>
            </div>
          </div>
        )}
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