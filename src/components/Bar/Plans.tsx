import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../Payment/PaymentForm';
import { PaymentMethod } from '../../types/PaymentMethods';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../services/subscriptionDetailsService';
import PlanCard from './PlanCard';
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
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptionPlan = async () => {
      if (!userDetails?.accountId) return;
      
      try {
        setLoading(true);
        const response = await fetchSubscriptionDetails(userDetails.accountId);
        setCurrentPlan(response.plan);
      } catch (error) {
        console.error('Error loading subscription plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionPlan();
  }, [userDetails?.accountId]);

  if (!userDetails) {
    return <div className="plans-container"><p>Loading user details...</p></div>;
  }

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
          <PlanCard
            key={plan.id}
            plan={plan}
            loading={loading}
            currentPlan={currentPlan}
            onSelect={handlePlanSelect}
          />
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