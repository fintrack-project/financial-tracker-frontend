import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../Payment/PaymentForm';
import SubscriptionPaymentMethodSelectionPopup from '../../popup/SubscriptionPaymentMethodSelectionPopup';
import SubscriptionNoPaymentMethodPopup from '../../popup/SubscriptionNoPaymentMethodPopup';
import { PaymentMethod } from '../../types/PaymentMethods';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../features/subscription/types/UserSubscription';
import { SubscriptionPlan } from '../../features/subscription/types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../features/subscription/services/subscriptionDetailsService';
import { stripePromise } from '../../config/stripe';
import PlanCard from './PlanCard';
import './Plans.css';
import { cancelSubscriptionApi, reactivateSubscriptionApi, downgradeSubscriptionApi } from '../../features/subscription/api/userSubscriptionApi';

export const ANNUAL_DISCOUNT_RATE = 0.2; // 20% discount for annual plans

// Move plans array outside component
const PLANS: (SubscriptionPlan & { color: string })[] = [
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
  const [isCancelling, setIsCancelling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleCancelPlan = async (planId: string) => {
    const basePlanId = planId.replace('_annual', '');
    const selectedPlan = PLANS.find(p => p.id === basePlanId);

    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }

    if (!subscription?.stripeSubscriptionId) {
      setError('No active subscription found');
      return;
    }

    console.log('Cancelling plan:', selectedPlan);

    try {
      setLoading(true);
      setError(null);
      
      const response = await cancelSubscriptionApi(subscription.stripeSubscriptionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel subscription');
      }

      // Refresh subscription details
      await onSubscriptionComplete(subscription.stripeSubscriptionId);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivatePlan = async (planId: string) => {
    const basePlanId = planId.replace('_annual', '');
    const selectedPlan = PLANS.find(p => p.id === basePlanId);

    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }

    if (!subscription?.stripeSubscriptionId) {
      setError('No active subscription found');
      return;
    }

    console.log('Reactivating plan:', selectedPlan);
    console.log('subscription.stripeSubscriptionId', subscription.stripeSubscriptionId);

    try {
      setLoading(true);
      setError(null);
      
      const response = await reactivateSubscriptionApi(subscription.stripeSubscriptionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to reactivate subscription');
      }

      // Refresh subscription details
      await onSubscriptionComplete(subscription.stripeSubscriptionId);
      setIsCancelling(false);
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      setError(error instanceof Error ? error.message : 'Failed to reactivate subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = async (planId: string) => {
    const basePlanId = planId.replace('_annual', '');
    const selectedPlan = PLANS.find(p => p.id === basePlanId);

    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }
    
    console.log('Upgrading plan:', selectedPlan);

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

  const handleDowngradePlan = async (planId: string) => {
    const basePlanId = planId.replace('_annual', '');
    const selectedPlan = PLANS.find(p => p.id === basePlanId);

    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }

    if (!userDetails?.accountId) {
      setError('No account ID found');
      return;
    }

    console.log('Downgrading plan:', selectedPlan);

    // Get the correct plan ID based on billing cycle
    const finalPlanId = getPlanId(basePlanId, billingCycle === 'annual');
    console.log('Selected plan ID:', finalPlanId, 'Billing cycle:', billingCycle);

    try {
      setLoading(true);
      setError(null);
      
      const response = await downgradeSubscriptionApi(
        userDetails.accountId, 
        finalPlanId
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to downgrade subscription');
      }

      // Refresh subscription details
      await onSubscriptionComplete(subscription.stripeSubscriptionId);
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      setError(error instanceof Error ? error.message : 'Failed to downgrade subscription');
    } finally {
      setLoading(false);
    }
  };
  

  const getPlanId = (basePlanId: string, isAnnual: boolean) => {
    if (basePlanId === 'plan_free') return 'plan_free';
    return isAnnual ? `${basePlanId}_annual` : basePlanId;
  };

  useEffect(() => {
    const loadSubscriptionPlan = async () => {
      if (!userDetails?.accountId) return;
      
      try {
        setLoading(true);
        const response = await fetchSubscriptionDetails(userDetails.accountId);
        const basePlanId = response.plan.id.replace('_annual', '');
        const plan = PLANS.find(p => p.id === basePlanId);
        if (plan) {
          const subscriptionPlan: SubscriptionPlan = {
            ...response.plan,
            amount: response.plan.id.includes('_annual') ? plan.amount * 12 * (1-ANNUAL_DISCOUNT_RATE) : plan.amount,
            interval: response.plan.id.includes('_annual') ? 'year' : 'month',
            description: `${plan.name} Plan`,
            features: plan.features
          };
          setCurrentPlan(subscriptionPlan);
          setIsCancelling(response.subscription.cancelAtPeriodEnd);
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
        const selectedPlanObj = PLANS.find(p => p.id === basePlanId);
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

  // Filter plans based on current subscription
  const filteredPlans = currentPlan && currentPlan.id === 'plan_free'
    ? PLANS
    : PLANS.filter(plan => plan.id !== 'plan_free');

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
        {filteredPlans.map((plan) => 
          (
            <PlanCard
              key={plan.id}
              plan={{
                id: plan.id,
                plan_group_id: plan.plan_group_id,
                name: plan.name,
                color: plan.color,
                features: plan.features || [],
                monthlyPrice: plan.amount,
                annualPrice: Number((plan.amount * 12 * (1 - ANNUAL_DISCOUNT_RATE)).toFixed(2)),
                isAnnual: billingCycle === 'annual'
              }}
              loading={loading}
              currentPlan={currentPlan}
              onCancel={handleCancelPlan}
              onUpgrade={handleUpgradePlan}
              onDowngrade={handleDowngradePlan}
              onReactivate={handleReactivatePlan}
              isCancelling={isCancelling}
            />
          )
        )}
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