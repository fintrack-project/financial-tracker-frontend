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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../Payment/PaymentForm';

interface SubscriptionProps {
  accountId: string;
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

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
      const [userData, subscriptionData, methods, defaultMethod] = await Promise.all([
        fetchUserDetails(accountId),
        fetchUserSubscription(accountId),
        fetchPaymentMethods(accountId),
        getDefaultPaymentMethod(accountId)
      ]);
      setUserDetails(userData);
      setSubscription(subscriptionData);
      setPaymentMethods(methods);
      setDefaultPaymentMethodState(defaultMethod);
      setError(null);
    } catch (err) {
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
      await deletePaymentMethod(accountId, paymentMethodId);
      await loadData(); // Reload data after deletion
    } catch (err) {
      setError('Failed to delete payment method. Please try again later.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(accountId, paymentMethodId);
      await loadData(); // Reload data after setting default
    } catch (err) {
      setError('Failed to set default payment method. Please try again later.');
    }
  };

  const handleConfirmPayment = async (paymentIntentId: string, paymentMethodId: string) => {
    try {
      await confirmPayment(accountId, paymentIntentId, paymentMethodId);
      await loadData(); // Reload data after confirmation
    } catch (err) {
      setError('Failed to confirm payment. Please try again later.');
    }
  };

  const handleAttachPaymentMethod = async (accountId: string, paymentMethodId: string) => {
    try {
      await attachPaymentMethod(accountId, paymentMethodId);
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
    if (!userDetails || !subscription) return null;

    const tableData = [
      {
        label: 'Current Plan',
        value: <AccountTier tier={userDetails.accountTier as 'free' | 'premium'} />,
      },
      {
        label: 'Subscription Status',
        value: subscription.status,
      },
      {
        label: 'Active Status',
        value: subscription.isActive ? 'Active' : 'Inactive',
      },
      {
        label: 'Next Billing Date',
        value: subscription.nextBillingDate ? formatDate(new Date(subscription.nextBillingDate)) : 'N/A',
      },
      {
        label: 'Last Payment Date',
        value: subscription.lastPaymentDate ? formatDate(new Date(subscription.lastPaymentDate)) : 'N/A',
      },
      {
        label: 'Subscription Period',
        value: `${formatDate(new Date(subscription.subscriptionStartDate))} - ${
          subscription.subscriptionEndDate ? formatDate(new Date(subscription.subscriptionEndDate)) : 'Ongoing'
        }`,
      },
      {
        label: 'Auto-Renew',
        value: subscription.cancelAtPeriodEnd ? 'Will cancel at period end' : 'Auto-renewing',
      },
    ];

    return <ProfileTable data={tableData} />;
  };

  const renderPlans = () => {
    if (!subscription) return null;

    const plans = [
      {
        name: 'Free',
        price: '$0',
        features: [
          'Basic expense tracking',
          'Limited reports',
          '1 user',
          '5GB storage',
          '1000 API calls/month',
        ],
      },
      {
        name: 'Premium',
        price: '$9.99',
        features: [
          'Advanced expense tracking',
          'Unlimited reports',
          'Multiple users',
          'Priority support',
          '50GB storage',
          'Unlimited API calls',
        ],
        featured: true,
      },
    ];

    return (
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`plan-card ${plan.featured ? 'featured' : ''}`}>
            <h3>{plan.name}</h3>
            <div className="price">{plan.price}/month</div>
            <ul className="features">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button 
              className="select-plan"
              disabled={plan.name.toLowerCase() === userDetails.accountTier.toLowerCase()}
            >
              {plan.name.toLowerCase() === userDetails.accountTier.toLowerCase() ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderPaymentMethods = () => {
    if (!userDetails) return null;

    return (
      <div className="payment-methods">
        <h3>Payment Methods</h3>
        {paymentMethods.length > 0 ? (
          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-method-item">
                <div className="payment-method-info">
                  <span className="card-brand">{method.cardBrand}</span>
                  <span className="card-last4">**** **** **** {method.cardLast4}</span>
                  <span className="card-expiry">
                    Expires {method.cardExpMonth}/{method.cardExpYear}
                  </span>
                  {method.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="payment-method-actions">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefaultPaymentMethod(method.id.toString())}
                      className="action-button"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id.toString())}
                    className="action-button delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No payment methods added yet.</p>
        )}

        <div className="add-payment-method">
          <h4>Add New Payment Method</h4>
          <Elements stripe={stripePromise}>
            <PaymentForm
              onSuccess={(paymentMethodId) => {
                if (userDetails) {
                  handleAttachPaymentMethod(userDetails.accountId, paymentMethodId);
                }
              }}
              onError={(error) => {
                console.error('Payment method error:', error);
                // You might want to show this error in a toast or alert
              }}
            />
          </Elements>
        </div>
      </div>
    );
  };

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h2>Subscription Management</h2>
        <div className="subscription-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'plans' ? 'active' : ''}
            onClick={() => setActiveTab('plans')}
          >
            Plans & Pricing
          </button>
          <button
            className={activeTab === 'payment' ? 'active' : ''}
            onClick={() => setActiveTab('payment')}
          >
            Payment Methods
          </button>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'plans' && renderPlans()}
      {activeTab === 'payment' && renderPaymentMethods()}
    </div>
  );
};

export default Subscription;