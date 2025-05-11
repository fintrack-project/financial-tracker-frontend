import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../Payment/PaymentForm';
import SubscriptionPaymentMethodSelectionPopup from '../../popup/SubscriptionPaymentMethodSelectionPopup';
import SubscriptionNoPaymentMethodPopup from '../../popup/SubscriptionNoPaymentMethodPopup';
import { PaymentMethod } from '../../types/PaymentMethods';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../services/subscriptionDetailsService';
import { stripePromise } from '../../config/stripe';
import PlanCard from './PlanCard';
import './Plans.css';

export const ANNUAL_DISCOUNT_RATE = 0.2; // 20% discount for annual plans

interface PlansProps {
  userDetails: UserDetails;
  subscription: UserSubscription;
  paymentMethods: PaymentMethod[];
  onPlanSelect: (planName: string, paymentMethodId?: string) => Promise<void>;
  onPaymentMethodAdd: (paymentMethodId: string) => Promise<void>;
  onTabChange: (tab: 'overview' | 'plans' | 'payment') => void;
  onSubscriptionComplete: (subscriptionId: string) => void;
}

const Plans: React.FC<PlansProps> = ({
  userDetails,
  subscription,
  paymentMethods,
  onPlanSelect,
  onPaymentMethodAdd,
  onTabChange,
  onSubscriptionComplete
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentMethodPopup, setShowPaymentMethodPopup] = useState(false);
  const [showNoPaymentMethodPopup, setShowNoPaymentMethodPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans: (SubscriptionPlan & { color: string })[] = [
    {
      id: 'plan_free',
      plan_group_id: 'free',
      name: 'Free',
      amount: 0,
      currency: 'USD',
      interval: 'month',
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
      id: 'plan_basic',
      plan_group_id: 'basic',
      name: 'Basic',
      amount: 4.99,
      currency: 'USD',
      interval: 'month',
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
      id: 'plan_premium',
      plan_group_id: 'premium',
      name: 'Premium',
      amount: 9.99,
      currency: 'USD',
      interval: 'month',
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

  const getPlanId = (basePlanId: string, isAnnual: boolean) => {
    if (basePlanId === 'plan_free') return 'plan_free';
    return isAnnual ? `${basePlanId}_annual` : basePlanId;
  };

  const handlePlanSelect = async (planId: string) => {
    const basePlanId = planId.replace('_annual', '');
    const selectedPlan = plans.find(p => p.id === basePlanId);
    
    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }
    
    // Get the correct plan ID based on billing cycle
    const finalPlanId = getPlanId(basePlanId, billingCycle === 'annual');
    console.log('Selected plan ID:', finalPlanId, 'Billing cycle:', billingCycle);
    
    setSelectedPlan(finalPlanId);
    setSelectedPlanName(selectedPlan.name);
    setError(null);

    if (basePlanId === 'plan_free') {
      await onPlanSelect(selectedPlan.name);
      return;
    }

    if (paymentMethods.length === 0) {
      setShowNoPaymentMethodPopup(true);
      return;
    }

    setShowPaymentMethodPopup(true);
  };

  useEffect(() => {
    const loadSubscriptionPlan = async () => {
      if (!userDetails?.accountId) return;
      
      try {
        setLoading(true);
        const response = await fetchSubscriptionDetails(userDetails.accountId);
        const basePlanId = response.plan.id.replace('_annual', '');
        const plan = plans.find(p => p.id === basePlanId);
        if (plan) {
          const subscriptionPlan: SubscriptionPlan = {
            ...response.plan,
            amount: response.plan.id.includes('_annual') ? plan.amount * 12 * (1-ANNUAL_DISCOUNT_RATE) : plan.amount,
            interval: response.plan.id.includes('_annual') ? 'year' : 'month',
            description: `${plan.name} Plan`,
            features: plan.features
          };
          setCurrentPlan(subscriptionPlan);
        }
      } catch (error) {
        console.error('Error loading subscription plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionPlan();
  }, [userDetails?.accountId]);

  const handleRedirectToPayment = () => {
    setShowNoPaymentMethodPopup(false);
    onTabChange('payment');
  };

  const handlePaymentMethodSelect = async (paymentMethodId: string) => {
    if (selectedPlan) {
      try {
        console.log('Processing payment for plan:', selectedPlan);
        const basePlanId = selectedPlan.replace('_annual', '');
        const selectedPlanObj = plans.find(p => p.id === basePlanId);
        if (!selectedPlanObj) {
          throw new Error('Invalid plan selected');
        }
        // Use the selectedPlan directly which already has the correct billing cycle
        await onPlanSelect(selectedPlan, paymentMethodId);
        setShowPaymentMethodPopup(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to update subscription. Please try again.');
        }
      }
    }
  };

  const handleAddPaymentMethod = () => {
    setShowPaymentMethodPopup(false);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    await onPaymentMethodAdd(paymentMethodId);
    setShowPaymentForm(false);
    
    if (selectedPlan) {
      handlePaymentMethodSelect(paymentMethodId);
    }
  };

  const handlePaymentError = (error: Error) => {
    setError(error.message);
  };

  return (
    <div className="plans-container">
      <div className="billing-cycle-toggle">
        <button
          className={`toggle-button ${billingCycle === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`toggle-button ${billingCycle === 'annual' ? 'active' : ''}`}
          onClick={() => setBillingCycle('annual')}
        >
          Annual (Save {ANNUAL_DISCOUNT_RATE * 100}%)
        </button>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={{
              id: plan.id,
              name: plan.name,
              color: plan.color,
              features: plan.features || [],
              monthlyPrice: plan.amount,
              annualPrice: Number((plan.amount * 12 * (1 - ANNUAL_DISCOUNT_RATE)).toFixed(2)),
              isAnnual: billingCycle === 'annual'
            }}
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

      {showNoPaymentMethodPopup && (
        <SubscriptionNoPaymentMethodPopup
          selectedPlanName={selectedPlanName}
          onRedirectToPayment={handleRedirectToPayment}
          onCancel={() => setShowNoPaymentMethodPopup(false)}
        />
      )}

      {showPaymentMethodPopup && selectedPlan && (
        <Elements stripe={stripePromise}>
          <SubscriptionPaymentMethodSelectionPopup
            paymentMethods={paymentMethods}
            selectedPlanName={selectedPlanName}
            selectedPlanId={selectedPlan}
            accountId={userDetails.accountId}
            onSelectPaymentMethod={handlePaymentMethodSelect}
            onAddPaymentMethod={handleAddPaymentMethod}
            onCancel={() => setShowPaymentMethodPopup(false)}
            onSubscriptionComplete={onSubscriptionComplete}
          />
        </Elements>
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