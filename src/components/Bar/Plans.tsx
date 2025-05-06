import React, { useState } from 'react';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../Payment/PaymentForm';
import { stripePromise } from '../../config/stripe';
import { PaymentMethod } from '../../types/PaymentMethods';
import './Plans.css';

interface PlansProps {
  userDetails: UserDetails;
  subscription: UserSubscription | null;
  paymentMethods: PaymentMethod[];
  onPlanSelect: (planName: string, paymentMethodId?: string) => void;
  onPaymentMethodAdd: (paymentMethodId: string) => void;
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

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setError(null);

    // If selecting Premium plan
    if (planName === 'Premium') {
      // Check if user has any payment methods
      if (paymentMethods.length === 0) {
        setError('Please add a payment method to subscribe to Premium plan');
        onTabChange('payment');
        return;
      }

      // Check if there's a default payment method
      const defaultMethod = paymentMethods.find(method => method.default);
      if (defaultMethod) {
        // Use default payment method
        onPlanSelect(planName, defaultMethod.stripePaymentMethodId);
      } else {
        // Show payment form to add a new payment method
        setShowPaymentForm(true);
      }
    } else {
      // For Free plan, no payment method needed
      onPlanSelect(planName);
    }
  };

  const handlePaymentSuccess = (paymentMethodId: string) => {
    onPaymentMethodAdd(paymentMethodId);
    if (selectedPlan) {
      onPlanSelect(selectedPlan, paymentMethodId);
    }
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  return (
    <div className="plans-container">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
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
              onClick={() => handlePlanSelect(plan.name)}
            >
              {plan.name.toLowerCase() === userDetails.accountTier.toLowerCase() ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {showPaymentForm && (
        <div className="payment-form-overlay">
          <div className="payment-form-container">
            <h3>Add Payment Method for {selectedPlan} Plan</h3>
            <Elements stripe={stripePromise}>
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  setError(error.message);
                  setShowPaymentForm(false);
                  setSelectedPlan(null);
                }}
              />
            </Elements>
            <button 
              className="cancel-button"
              onClick={() => {
                setShowPaymentForm(false);
                setSelectedPlan(null);
                setError(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans; 