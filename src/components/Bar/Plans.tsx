import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../Payment/PaymentForm';
import { PaymentMethod } from '../../types/PaymentMethods';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import './Plans.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

interface PlansProps {
  userDetails: UserDetails;
  subscription: UserSubscription;
  paymentMethods: PaymentMethod[];
  onPlanSelect: (planName: string, paymentMethodId?: string) => Promise<void>;
  onPaymentMethodAdd: (paymentMethodId: string) => Promise<void>;
  onTabChange: (tab: 'overview' | 'plans' | 'payment') => void;
}

const Plans: React.FC<PlansProps> = ({
  userDetails,
  subscription,
  paymentMethods,
  onPlanSelect,
  onPaymentMethodAdd,
  onTabChange
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      color: '#6c757d',
      features: [
        '1 year transaction history',
        'Up to 2 custom categories',
        'Daily market data updates',
        'Basic dashboard',
        '1GB storage',
        'Basic reports',
        'Manual data entry',
        'Basic export (CSV)'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 4.99,
      color: '#28a745',
      features: [
        '5 years transaction history',
        'Unlimited custom categories',
        '4x daily market data updates',
        'Advanced dashboard',
        '10GB storage',
        'Custom reports',
        'Multiple export formats',
        'Basic data visualization',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      color: '#007bff',
      features: [
        'Unlimited transaction history',
        'Unlimited custom categories',
        'Live market data updates',
        'Customizable dashboard',
        '50GB storage',
        'Advanced reports',
        'Multiple export formats',
        'Advanced data visualization',
        'Priority support',
        'Advanced search and filtering',
        'Custom integrations'
      ]
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    setError(null);

    if (planId === 'free') {
      await onPlanSelect(planId);
      return;
    }

    if (paymentMethods.length === 0) {
      setError('Please add a payment method before selecting a paid plan.');
      setShowPaymentForm(true);
      return;
    }

    const hasDefaultPaymentMethod = paymentMethods.some(method => method.default);
    if (!hasDefaultPaymentMethod) {
      setError('Please set a default payment method before selecting a paid plan.');
      setShowPaymentForm(true);
      return;
    }

    const defaultMethod = paymentMethods.find(method => method.default);
    if (defaultMethod) {
      await onPlanSelect(planId, defaultMethod.stripePaymentMethodId);
    }
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    await onPaymentMethodAdd(paymentMethodId);
    setShowPaymentForm(false);
    if (selectedPlan) {
      await onPlanSelect(selectedPlan, paymentMethodId);
    }
  };

  const handlePaymentError = (error: Error) => {
    setError(error.message);
  };

  return (
    <div className="plans-container">
      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="plan-card"
            style={{ borderColor: plan.color }}
          >
            <div className="plan-header" style={{ backgroundColor: plan.color }}>
              <h3>{plan.name}</h3>
              <div className="plan-price">
                ${plan.price}
                <span className="price-period">/month</span>
              </div>
              {plan.price > 0 && (
                <div className="annual-price">
                  ${(plan.price * 12 * 0.8).toFixed(2)}
                  <span className="price-period">/year (20% off)</span>
                </div>
              )}
            </div>
            <div className="plan-features">
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              className="select-plan-button"
              style={{ backgroundColor: plan.color }}
              onClick={() => handlePlanSelect(plan.id)}
              disabled={plan.id === userDetails.accountTier.toLowerCase()}
            >
              {plan.id === userDetails.accountTier.toLowerCase() ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showPaymentForm && (
        <div className="payment-form-container">
          <Elements stripe={stripePromise}>
            <PaymentForm
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentForm(false)}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default Plans; 