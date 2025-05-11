import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { fetchUserSubscription, updateSubscription } from '../../services/userSubscriptionService';
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
  console.log('🔵 Subscription component rendered with accountId:', accountId);

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentMethod, setDefaultPaymentMethodState] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'payment'>('overview');

  const loadData = async () => {
    console.log('🔄 Starting to load subscription data...');
    try {
      setLoading(true);
      
      console.log('📡 Fetching user details...');
      const userData = await fetchUserDetails(accountId);
      console.log('✅ User details fetched:', userData);
      
      let subscriptionData;
      try {
        console.log('📡 Fetching subscription data...');
        subscriptionData = await fetchUserSubscription(accountId);
        console.log('✅ Raw subscription data from API:', subscriptionData);

        // Log raw subscription data for debugging
        console.log('📅 Raw subscription dates from API:', {
          nextBillingDate: subscriptionData.nextBillingDate,
          lastPaymentDate: subscriptionData.lastPaymentDate,
          subscriptionStartDate: subscriptionData.subscriptionStartDate,
          subscriptionEndDate: subscriptionData.subscriptionEndDate,
          isActive: subscriptionData.isActive,
          status: subscriptionData.status
        });

        // Only ensure isActive is set based on status
        if (subscriptionData) {
          subscriptionData = {
            ...subscriptionData,
            isActive: subscriptionData.isActive ?? (subscriptionData.status === 'active')
          };
        }
      } catch (error) {
        console.log('⚠️ No subscription found, creating default...');
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
        console.log('📡 Fetching payment methods...');
        methods = await fetchPaymentMethods(accountId);
        console.log('✅ Payment methods fetched:', methods);
      } catch (error) {
        console.log('⚠️ No payment methods found');
      }
      
      let defaultMethod = null;
      try {
        console.log('📡 Fetching default payment method...');
        defaultMethod = await getDefaultPaymentMethod(accountId);
        console.log('✅ Default payment method fetched:', defaultMethod);
      } catch (error) {
        console.log('⚠️ No default payment method found');
      }

      console.log('📝 Updating component state with subscription data:', subscriptionData);
      setUserDetails(userData);
      setSubscription(subscriptionData);
      setPaymentMethods(methods);
      setDefaultPaymentMethodState(defaultMethod);
      setError(null);
      console.log('✅ Component state updated successfully');
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
    console.log('🔵 Deleting payment method:', paymentMethodId);
    try {
      await deletePaymentMethod(accountId, paymentMethodId);
      console.log('✅ Payment method deleted successfully');
      await loadData();
    } catch (err) {
      console.error('❌ Error deleting payment method:', err);
      setError('Failed to delete payment method. Please try again later.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    console.log('🔵 Setting default payment method:', paymentMethodId);
    try {
      await setDefaultPaymentMethod(accountId, paymentMethodId);
      console.log('✅ Default payment method set successfully');
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

      console.log('📡 Calling attachPaymentMethod API...');
      await attachPaymentMethod(accountId, paymentMethodId);
      console.log('✅ Payment method attached successfully');

      // Reload data to reflect changes
      console.log('🔄 Reloading subscription data...');
      await loadData();
      console.log('✅ Data reload complete');
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
      console.log('📡 Calling updateSubscription API...');
      const response = await updateSubscription(accountId, planName, paymentMethodId);
      console.log('✅ Update subscription response:', response);

      // Fetch fresh subscription data
      console.log('📡 Fetching updated subscription data...');
      const updatedSubscription = await fetchUserSubscription(accountId);
      console.log('✅ Updated subscription data:', updatedSubscription);

      // Update state with fresh data
      setSubscription(updatedSubscription);

      // Reload all data to ensure consistency
      console.log('🔄 Reloading all data...');
      await loadData();
      console.log('✅ Data reload complete');
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
    console.log('🔵 Subscription completed:', subscriptionId);
    try {
      // Fetch fresh subscription data
      const updatedSubscription = await fetchUserSubscription(accountId);
      console.log('✅ Updated subscription data:', updatedSubscription);
      
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
    console.log('🎨 Rendering overview tab');
    if (!userDetails || !subscription) {
      console.log('⚠️ Cannot render overview: missing user details or subscription');
      return null;
    }

    // Log raw subscription data for debugging
    console.log('📅 Raw subscription dates:', {
      nextBillingDate: subscription.nextBillingDate,
      lastPaymentDate: subscription.lastPaymentDate,
      subscriptionStartDate: subscription.subscriptionStartDate,
      subscriptionEndDate: subscription.subscriptionEndDate
    });

    // Log parsed dates for debugging
    if (Array.isArray(subscription.nextBillingDate)) {
      console.log('📅 Parsed next billing date:', {
        raw: subscription.nextBillingDate,
        parsed: formatDate(subscription.nextBillingDate)
      });
    }
    if (Array.isArray(subscription.lastPaymentDate)) {
      console.log('📅 Parsed last payment date:', {
        raw: subscription.lastPaymentDate,
        parsed: formatDate(subscription.lastPaymentDate)
      });
    }
    if (Array.isArray(subscription.subscriptionStartDate)) {
      console.log('📅 Parsed start date:', {
        raw: subscription.subscriptionStartDate,
        parsed: formatDate(subscription.subscriptionStartDate)
      });
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

        <div className="usage-stats">
          <h3>Usage Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span>Storage Used</span>
              <span>1.2 GB / 10 GB</span>
            </div>
            <div className="stat-item">
              <span>API Calls</span>
              <span>2,450 / 5,000</span>
            </div>
            <div className="stat-item">
              <span>Custom Categories</span>
              <span>3 / 5</span>
            </div>
            <div className="stat-item">
              <span>Team Members</span>
              <span>1 / 3</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlans = () => {
    console.log('🎨 Rendering plans tab');
    if (!subscription || !userDetails) {
      console.log('⚠️ Cannot render plans: missing subscription or user details');
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
    console.log('🎨 Rendering payment methods tab');
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

  console.log('🎨 Rendering main subscription component');
  if (loading) {
    console.log('⏳ Loading state active');
    return <p>Loading subscription details...</p>;
  }

  if (error) {
    console.log('❌ Error state active:', error);
    return <p className="subscription-error">{error}</p>;
  }

  if (!userDetails) {
    console.log('⚠️ No user details available');
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