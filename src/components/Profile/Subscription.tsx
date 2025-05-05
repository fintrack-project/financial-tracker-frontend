import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { fetchUserSubscription } from '../../services/userSubscriptionService';
import { fetchPaymentMethods, getDefaultPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, confirmPayment, attachPaymentMethod } from '../../services/paymentMethodService';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { PaymentMethod } from '../../types/PaymentMethod';
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
      console.log('Attaching payment method:', { accountId, paymentMethodId });
      await attachPaymentMethod(accountId, paymentMethodId);
      console.log('Payment method attached successfully');
      await loadData(); // Reload user details to get updated payment methods
    } catch (error) {
      console.error('Error attaching payment method:', error);
      // You might want to show this error in a toast or alert
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
        onAttach={(paymentMethodId) => handleAttachPaymentMethod(userDetails.accountId, paymentMethodId)}
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