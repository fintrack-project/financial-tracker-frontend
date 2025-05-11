import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { fetchUserSubscription, updateSubscription } from '../../services/userSubscriptionService';
import { fetchPaymentMethods, getDefaultPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, confirmPayment, attachPaymentMethod } from '../../services/paymentMethodService';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { PaymentMethod, PaymentError } from '../../types/PaymentMethods';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
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
      
      // Fetch user details from backend
      const userData = await fetchUserDetails(accountId);
      
      // Fetch subscription data or create empty subscription if none exists
      let subscriptionData;
      try {
        subscriptionData = await fetchUserSubscription(accountId);
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
      
      // Fetch existing payment methods
      let methods: PaymentMethod[] = [];
      try {
        methods = await fetchPaymentMethods(accountId);
      } catch (error) {
        // No payment methods found, using empty array
      }
      
      // Fetch default payment method
      let defaultMethod = null;
      try {
        defaultMethod = await getDefaultPaymentMethod(accountId);
      } catch (error) {
        // No default payment method found
      }

      // Update all state with fetched data
      setUserDetails(userData);
      setSubscription(subscriptionData);
      setPaymentMethods(methods);
      setDefaultPaymentMethodState(defaultMethod);
      setError(null);
    } catch (err) {
      console.error('Error in loadData:', err);
      setError('Failed to load subscription details. Please try again later.');
      setUserDetails(null);
      setSubscription(null);
      setPaymentMethods([]);
      setDefaultPaymentMethodState(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [accountId]);

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      // Delete payment method from backend
      await deletePaymentMethod(accountId, paymentMethodId);
      // Reload data to reflect changes
      await loadData();
    } catch (err) {
      console.error('Error deleting payment method:', err);
      setError('Failed to delete payment method. Please try again later.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      // Set payment method as default in backend
      await setDefaultPaymentMethod(accountId, paymentMethodId);
      // Reload data to reflect changes
      await loadData();
    } catch (err) {
      console.error('Error setting default payment method:', err);
      setError('Failed to set default payment method. Please try again later.');
    }
  };

  const handleConfirmPayment = async (paymentIntentId: string, paymentMethodId: string) => {
    console.log('🔵 Starting payment confirmation:', {
      paymentIntentId,
      paymentMethodId,
      accountId
    });

    try {
      console.log('📡 Calling confirmPayment API...');
      await confirmPayment(accountId, paymentIntentId, paymentMethodId);
      console.log('✅ Payment confirmation successful');

      // Reload data to reflect changes
      console.log('🔄 Reloading subscription data...');
      await loadData();
      console.log('✅ Data reload complete');
    } catch (err) {
      console.error('❌ Error confirming payment:', err);
      setError('Failed to confirm payment. Please try again later.');
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

      // Reload data to reflect changes
      console.log('🔄 Reloading subscription data...');
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

  if (loading) {
    return <p>Loading subscription details...</p>;
  }

  if (error) {
    return <p className="subscription-error">{error}</p>;
  }

  if (!userDetails) {
    return <p>No subscription details available.</p>;
  }

  const renderOverview = () => {
    if (!userDetails) return null;

    return (
      <div className="subscription-overview">
        <div className="current-plan-card">
          <h3>Current Subscription</h3>
          <div className="plan-details">
            <div className="plan-name">
              <AccountTier accountId={accountId} />
            </div>
            <div className="plan-status">
              {subscription?.isActive ? 'Active' : 'Inactive'}
              {subscription?.cancelAtPeriodEnd && ' (Cancelling)'}
            </div>
            <div className="plan-dates">
              <div>
                <strong>Next Billing Date:</strong> {subscription?.nextBillingDate ? formatDate(new Date(subscription.nextBillingDate)) : 'N/A'}
              </div>
              <div>
                <strong>Last Payment:</strong> {subscription?.lastPaymentDate ? formatDate(new Date(subscription.lastPaymentDate)) : 'N/A'}
              </div>
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
    if (!subscription) return null;

    // Render subscription plans section
    return (
      <Plans
        userDetails={userDetails}
        subscription={subscription}
        paymentMethods={paymentMethods}
        onPlanSelect={handlePlanSelect}
        onPaymentMethodAdd={handlePaymentMethodAdd}
        onTabChange={setActiveTab}
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

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h2>Subscription Management</h2>
        <SubscriptionTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
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