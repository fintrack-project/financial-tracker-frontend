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
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'payment-methods'>('overview');

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

  const renderOverview = () => (
    <div className="subscription-overview">
      <div className="current-plan-card">
        <h3>Current Plan</h3>
        <div className="plan-details">
          <div className="plan-name">{userDetails.accountTier || 'No Plan'}</div>
          <div className="plan-status">{userDetails.isActiveSubscription ? 'Active' : 'Inactive'}</div>
          <div className="plan-dates">
            <div>Next Billing: {formatDate(userDetails.nextBillingDate, true) || 'N/A'}</div>
            <div>Last Payment: {formatDate(userDetails.lastPaymentDate, true) || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="usage-stats">
        <h3>Usage Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span>Storage</span>
            <span>{userDetails.storageLimit}GB</span>
          </div>
          <div className="stat-item">
            <span>API Usage</span>
            <span>{userDetails.apiUsageLimit} calls</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="subscription-plans">
      <div className="plans-grid">
        <div className="plan-card">
          <h3>Basic</h3>
          <div className="price">$9.99/month</div>
          <ul className="features">
            <li>5GB Storage</li>
            <li>1,000 API calls/month</li>
            <li>Basic Analytics</li>
          </ul>
          <button className="select-plan">Select Plan</button>
        </div>
        <div className="plan-card featured">
          <h3>Premium</h3>
          <div className="price">$19.99/month</div>
          <ul className="features">
            <li>20GB Storage</li>
            <li>5,000 API calls/month</li>
            <li>Advanced Analytics</li>
            <li>Priority Support</li>
          </ul>
          <button className="select-plan">Select Plan</button>
        </div>
        <div className="plan-card">
          <h3>Enterprise</h3>
          <div className="price">$49.99/month</div>
          <ul className="features">
            <li>100GB Storage</li>
            <li>Unlimited API calls</li>
            <li>Custom Analytics</li>
            <li>24/7 Support</li>
            <li>Custom Integration</li>
          </ul>
          <button className="select-plan">Select Plan</button>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="payment-methods">
      <div className="saved-methods">
        <h3>Saved Payment Methods</h3>
        <div className="methods-list">
          {userDetails.paymentMethod ? (
            <div className="method-card">
              <div className="method-info">
                <span className="card-brand">{userDetails.paymentMethod}</span>
                <span className="card-last4">**** **** **** 4242</span>
              </div>
              <div className="method-actions">
                <button className="set-default">Set as Default</button>
                <button className="remove">Remove</button>
              </div>
            </div>
          ) : (
            <p>No payment methods saved</p>
          )}
        </div>
        <button className="add-method">Add New Payment Method</button>
      </div>
    </div>
  );

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
            className={activeTab === 'payment-methods' ? 'active' : ''} 
            onClick={() => setActiveTab('payment-methods')}
          >
            Payment Methods
          </button>
        </div>
      </div>

      <div className="subscription-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'plans' && renderPlans()}
        {activeTab === 'payment-methods' && renderPaymentMethods()}
      </div>
    </div>
  );
};

export default Subscription;