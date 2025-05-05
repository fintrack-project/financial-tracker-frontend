import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { fetchUserSubscription, updateSubscriptionPlan } from '../../services/userSubscriptionService';
import { fetchPaymentMethods, getDefaultPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, confirmPayment, attachPaymentMethod } from '../../services/paymentMethodService';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { PaymentMethod } from '../../types/PaymentMethods';
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
      console.log('Starting loadData with accountId:', accountId);
      setLoading(true);
      
      console.log('Fetching user details...');
      const userData = await fetchUserDetails(accountId);
      console.log('User details response:', userData);
      
      console.log('Fetching subscription data...');
      let subscriptionData;
      try {
        subscriptionData = await fetchUserSubscription(accountId);
        console.log('Subscription data response:', subscriptionData);
      } catch (error) {
        console.log('No subscription data found, using default values');
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
      
      console.log('Fetching payment methods...');
      let methods: PaymentMethod[] = [];
      try {
        methods = await fetchPaymentMethods(accountId);
        console.log('Payment methods response:', methods);
      } catch (error) {
        console.log('No payment methods found, using empty array');
      }
      
      console.log('Fetching default payment method...');
      let defaultMethod = null;
      try {
        defaultMethod = await getDefaultPaymentMethod(accountId);
        console.log('Default payment method response:', defaultMethod);
      } catch (error) {
        console.log('No default payment method found');
      }

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
      console.log('Deleting payment method:', paymentMethodId);
      await deletePaymentMethod(accountId, paymentMethodId);
      console.log('Payment method deleted successfully');
      await loadData(); // Reload data after deletion
    } catch (err) {
      console.error('Error deleting payment method:', err);
      setError('Failed to delete payment method. Please try again later.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      console.log('Setting default payment method:', paymentMethodId);
      await setDefaultPaymentMethod(accountId, paymentMethodId);
      console.log('Default payment method set successfully');
      await loadData(); // Reload data after setting default
    } catch (err) {
      console.error('Error setting default payment method:', err);
      setError('Failed to set default payment method. Please try again later.');
    }
  };

  const handleConfirmPayment = async (paymentIntentId: string, paymentMethodId: string) => {
    try {
      console.log('Confirming payment:', { paymentIntentId, paymentMethodId });
      await confirmPayment(accountId, paymentIntentId, paymentMethodId);
      console.log('Payment confirmed successfully');
      await loadData(); // Reload data after confirmation
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError('Failed to confirm payment. Please try again later.');
    }
  };

  const handleAttachPaymentMethod = async (accountId: string, paymentMethodId: string) => {
    try {
      console.log('=== Payment Method Attachment Process ===');
      console.log('1. Starting attachment:', {
        accountId,
        paymentMethodId,
        hasUserDetails: !!userDetails
      });

      if (!accountId || !paymentMethodId) {
        console.error('2. Missing required data:', {
          hasAccountId: !!accountId,
          hasPaymentMethodId: !!paymentMethodId
        });
        throw new Error('Missing required data for payment method attachment');
      }

      console.log('3. Calling attachPaymentMethod service...');
      await attachPaymentMethod(accountId, paymentMethodId);
      console.log('4. Payment method attached successfully');
      
      console.log('5. Reloading data...');
      await loadData();
      console.log('6. Data reloaded successfully');
    } catch (error) {
      console.error('7. Error in handleAttachPaymentMethod:', {
        error,
        type: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('card was declined')) {
          setError('The card was declined. Please check your card details and try again.');
        } else if (error.message.includes('payment method')) {
          setError('Failed to attach payment method. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handlePlanSelect = async (planName: string) => {
    try {
      console.log('Updating subscription plan:', planName);
      await updateSubscriptionPlan(accountId, planName);
      console.log('Subscription plan updated successfully');
      await loadData(); // Reload data after plan update
    } catch (err) {
      console.error('Error updating plan:', err);
      setError('Failed to update subscription plan. Please try again later.');
    }
  };

  const handlePaymentMethodAdd = async (paymentMethodId: string) => {
    try {
      await handleAttachPaymentMethod(accountId, paymentMethodId);
      // After successful payment method addition, reload the data
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

    const tableData = [
      {
        label: 'Current Plan',
        value: <AccountTier tier={userDetails.accountTier as 'free' | 'premium'} />,
      },
      {
        label: 'Subscription Status',
        value: subscription?.status || 'inactive',
      },
      {
        label: 'Active Status',
        value: subscription?.isActive ? 'Active' : 'Inactive',
      },
      {
        label: 'Next Billing Date',
        value: subscription?.nextBillingDate ? formatDate(new Date(subscription.nextBillingDate)) : 'N/A',
      },
      {
        label: 'Last Payment Date',
        value: subscription?.lastPaymentDate ? formatDate(new Date(subscription.lastPaymentDate)) : 'N/A',
      },
      {
        label: 'Subscription Period',
        value: subscription ? `${formatDate(new Date(subscription.subscriptionStartDate))} - ${
          subscription.subscriptionEndDate ? formatDate(new Date(subscription.subscriptionEndDate)) : 'Ongoing'
        }` : 'No active subscription',
      },
      {
        label: 'Auto-Renew',
        value: subscription?.cancelAtPeriodEnd ? 'Will cancel at period end' : 'Auto-renewing',
      },
    ];

    return <ProfileTable data={tableData} />;
  };

  const renderPlans = () => {
    if (!subscription) return null;

    return (
      <Plans
        userDetails={userDetails}
        subscription={subscription}
        onPlanSelect={handlePlanSelect}
        onPaymentMethodAdd={handlePaymentMethodAdd}
      />
    );
  };

  const renderPaymentMethods = () => {
    if (!userDetails) return null;

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

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'plans' && renderPlans()}
      {activeTab === 'payment' && renderPaymentMethods()}
    </div>
  );
};

export default Subscription;