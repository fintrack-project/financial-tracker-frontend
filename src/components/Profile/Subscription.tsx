import React, { useState } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { UserDetails } from '../../types/UserDetails';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import { formatDate } from '../../utils/FormatDate';
import './Subscription.css';

interface SubscriptionProps {
  accountId: string;
}

const Subscription: React.FC<SubscriptionProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'payment'>('overview');

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchUserDetails(accountId);
      setUserDetails(data);
      setError(null);
    } catch (err) {
      setError('Failed to load subscription details. Please try again later.');
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUserDetails();
  }, [accountId]);

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
        value: 'Premium',
        status: <span className="plan-status">Active</span>,
      },
      {
        label: 'Billing Cycle',
        value: 'Monthly',
      },
      {
        label: 'Next Billing Date',
        value: 'March 1, 2024',
      },
      {
        label: 'Payment Method',
        value: 'Visa ending in 4242',
      },
    ];

    return <ProfileTable data={tableData} />;
  };

  const renderPlans = () => {
    const plans = [
      {
        name: 'Free',
        price: '$0',
        features: ['Basic expense tracking', 'Limited reports', '1 user'],
      },
      {
        name: 'Premium',
        price: '$9.99',
        features: ['Advanced expense tracking', 'Unlimited reports', 'Multiple users', 'Priority support'],
        featured: true,
      },
      {
        name: 'Enterprise',
        price: '$29.99',
        features: ['Custom integrations', 'Dedicated support', 'Unlimited users', 'Advanced analytics'],
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
            <button className="select-plan">Select Plan</button>
          </div>
        ))}
      </div>
    );
  };

  const renderPaymentMethods = () => {
    const tableData = [
      {
        label: 'Primary Payment Method',
        value: 'Visa ending in 4242',
        status: 'Expires 12/24',
        actions: (
          <div className="method-actions">
            <button className="remove">Remove</button>
          </div>
        ),
      },
      {
        label: 'Secondary Payment Method',
        value: 'Mastercard ending in 8888',
        status: 'Expires 09/25',
        actions: (
          <div className="method-actions">
            <button className="set-default">Set as Default</button>
            <button className="remove">Remove</button>
          </div>
        ),
      },
    ];

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