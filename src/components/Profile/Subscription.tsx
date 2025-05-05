import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { fetchPaymentMethods, getDefaultPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, confirmPayment } from '../../services/paymentMethodService';
import { UserDetails } from '../../types/UserDetails';
import { PaymentMethod } from '../../types/PaymentMethod';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import { formatDate } from '../../utils/FormatDate';
import AccountTier from './AccountTier';
import './Subscription.css';

interface SubscriptionProps {
  accountId: string;
}

const Subscription: React.FC<SubscriptionProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [defaultPaymentMethod, setDefaultPaymentMethodState] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'payment'>('overview');

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, methods, defaultMethod] = await Promise.all([
        fetchUserDetails(accountId),
        fetchPaymentMethods(accountId),
        getDefaultPaymentMethod(accountId)
      ]);
      setUserDetails(userData);
      setPaymentMethods(methods);
      setDefaultPaymentMethodState(defaultMethod);
      setError(null);
    } catch (err) {
      setError('Failed to load subscription details. Please try again later.');
      setUserDetails(null);
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
    const tableData = [
      {
        label: 'Current Plan',
        value: <AccountTier tier={userDetails.accountTier as 'free' | 'premium'} />,
      },
      {
        label: 'Default Payment Method',
        value: defaultPaymentMethod ? (
          <div className="method-info">
            <span className="card-brand">{defaultPaymentMethod.cardBrand}</span>
            <span className="card-last4">**** {defaultPaymentMethod.cardLast4}</span>
          </div>
        ) : 'No default payment method',
      },
      {
        label: 'Billing Address',
        value: defaultPaymentMethod?.billingAddress || 'No billing address added',
      },
    ];

    return <ProfileTable data={tableData} />;
  };

  const renderPlans = () => {
    const plans = [
      {
        name: 'Free',
        price: '$0',
        features: [
          'Basic expense tracking',
          'Limited reports',
          '1 user',
          `${userDetails.storageLimit}GB storage`,
          `${userDetails.apiUsageLimit} API calls/month`,
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
    if (paymentMethods.length === 0) {
      return (
        <div className="payment-methods">
          <p>No payment methods added yet.</p>
          <button className="add-method">+ Add Payment Method</button>
        </div>
      );
    }

    const tableData = paymentMethods.map(method => ({
      label: 'Payment Method',
      value: (
        <div className="method-info">
          <span className="card-brand">{method.cardBrand}</span>
          <span className="card-last4">**** {method.cardLast4}</span>
          <span className="expiration">Expires {method.cardExpMonth}/{method.cardExpYear}</span>
        </div>
      ),
      status: method.isDefault ? 'Default' : null,
      actions: (
        <div className="method-actions">
          {!method.isDefault && (
            <button 
              className="set-default"
              onClick={() => handleSetDefaultPaymentMethod(method.stripePaymentMethodId)}
            >
              Set as Default
            </button>
          )}
          <button 
            className="remove"
            onClick={() => handleDeletePaymentMethod(method.stripePaymentMethodId)}
          >
            Remove
          </button>
        </div>
      ),
    }));

    return (
      <div className="payment-methods">
        <ProfileTable data={tableData} />
        <button className="add-method">+ Add Payment Method</button>
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