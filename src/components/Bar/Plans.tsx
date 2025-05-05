import React, { useState } from 'react';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../Payment/PaymentForm';
import { stripePromise } from '../../config/stripe';
import './Plans.css';

interface PlansProps {
  userDetails: UserDetails;
  subscription: UserSubscription | null;
  onPlanSelect: (planName: string) => void;
  onPaymentMethodAdd: (paymentMethodId: string) => void;
}

const Plans: React.FC<PlansProps> = ({ 
  userDetails, 
  subscription, 
  onPlanSelect,
  onPaymentMethodAdd 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (paymentMethodId: string) => {
    onPaymentMethodAdd(paymentMethodId);
    onPlanSelect(selectedPlan!);
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  return (
    <div className="plans-container">
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
                  console.error('Payment method error:', error);
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