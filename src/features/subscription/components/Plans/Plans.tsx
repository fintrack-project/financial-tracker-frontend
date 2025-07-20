import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../Payment/PaymentForm';
import SubscriptionPaymentMethodSelectionPopup from '../Modals/SubscriptionPaymentMethodSelectionPopup';
import SubscriptionNoPaymentMethodPopup from '../Modals/SubscriptionNoPaymentMethodPopup';
import CancellationConfirmation from '../SubscriptionPolicy/CancellationConfirmation';
import UpgradeConfirmation from '../SubscriptionPolicy/UpgradeConfirmation';
import DowngradeConfirmation from '../SubscriptionPolicy/DowngradeConfirmation';
import { PaymentMethod } from '../../../../shared/types/PaymentMethods';
import { UserDetails } from '../../../../shared/types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import { fetchSubscriptionDetails } from '../../services/subscriptionDetailsService';
import { stripePromise } from '../../../../shared/config/stripe';
import PlanCard from './PlanCard';
import './Plans.css';
import { cancelSubscriptionApi, reactivateSubscriptionApi, downgradeSubscriptionApi } from '../../api/userSubscriptionApi';

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
    color: 'var(--tier-free-bg)',
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
    color: 'var(--tier-basic-bg)',
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
    color: 'var(--tier-premium-bg)',
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
  const [showCancellationConfirmation, setShowCancellationConfirmation] = useState(false);
  const [planToCancel, setPlanToCancel] = useState<string | null>(null);
  const [showUpgradeConfirmation, setShowUpgradeConfirmation] = useState(false);
  const [planToUpgrade, setPlanToUpgrade] = useState<string | null>(null);
  const [showDowngradeConfirmation, setShowDowngradeConfirmation] = useState(false);
  const [planToDowngrade, setPlanToDowngrade] = useState<string | null>(null);

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

    // Show cancellation confirmation popup instead of cancelling immediately
    setPlanToCancel(planId);
    setShowCancellationConfirmation(true);
  };

  const handleConfirmCancellation = async () => {
    if (!planToCancel || !subscription?.stripeSubscriptionId) {
      setError('No plan selected for cancellation');
      return;
    }

    const basePlanId = planToCancel.replace('_annual', '');
    const selectedPlan = PLANS.find(p => p.id === basePlanId);

    if (!selectedPlan) {
      setError('Invalid plan selected');
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
      setShowCancellationConfirmation(false);
      setPlanToCancel(null);
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

    // Show upgrade confirmation popup instead of proceeding directly
    setPlanToUpgrade(planId);
    setShowUpgradeConfirmation(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!planToUpgrade || !currentPlan) {
      setError('No plan selected for upgrade');
      return;
    }

    const basePlanId = planToUpgrade.replace('_annual', '');
    const selectedPlan = PLANS.find(p => p.id === basePlanId);

    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }

    // Get the correct plan ID based on billing cycle
    const finalPlanId = getPlanId(basePlanId, billingCycle === 'annual');
    console.log('Selected plan ID:', finalPlanId, 'Billing cycle:', billingCycle);
    
    setSelectedPlan(finalPlanId);
    // Add billing cycle to plan name for popup display
    const planDisplayName = `${selectedPlan.name} ${billingCycle === 'annual' ? 'Annual' : 'Monthly'}`;
    setSelectedPlanName(planDisplayName);
    setError(null);

    if (basePlanId === 'plan_free') {
      await onPlanSelect(selectedPlan.name);
      setShowUpgradeConfirmation(false);
      setPlanToUpgrade(null);
      return;
    }

    if (paymentMethods.length === 0) {
      setShowUpgradeConfirmation(false);
      setPlanToUpgrade(null);
      setShowNoPaymentMethodPopup(true);
      return;
    }

    setShowUpgradeConfirmation(false);
    setPlanToUpgrade(null);
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

    // Show downgrade confirmation popup instead of proceeding directly
    setPlanToDowngrade(planId);
    setShowDowngradeConfirmation(true);
  };

  const handleConfirmDowngrade = async () => {
    if (!planToDowngrade || !userDetails?.accountId) {
      setError('No plan selected for downgrade');
      return;
    }

    const basePlanId = planToDowngrade.replace('_annual', '');
    const selectedPlan = PLANS.find(p => p.id === basePlanId);

    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }

    console.log('Confirming downgrade to plan:', selectedPlan);

    // FIXED: Use current plan's billing cycle, not UI toggle
    const isCurrentPlanAnnual = currentPlan?.interval === 'year';
    const finalPlanId = getPlanId(basePlanId, isCurrentPlanAnnual);
    console.log('Selected plan ID:', finalPlanId, 'Current plan interval:', currentPlan?.interval);

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
      setShowDowngradeConfirmation(false);
      setPlanToDowngrade(null);
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
                id: getPlanId(plan.id, billingCycle === 'annual'),
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

      {showCancellationConfirmation && planToCancel && currentPlan && (
        <div className="subscription-popup-overlay">
          <div className="subscription-popup-container">
            <div className="subscription-popup-header">
              <h3>Cancel Subscription</h3>
              <button
                className="subscription-close-button"
                onClick={() => {
                  setShowCancellationConfirmation(false);
                  setPlanToCancel(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="subscription-popup-content">
              <CancellationConfirmation
                accountId={userDetails.accountId}
                currentPlan={currentPlan}
                daysRemaining={(() => {
                  if (!subscription?.nextBillingDate) return 30;
                  
                  try {
                    const nextBillingDate = new Date(subscription.nextBillingDate);
                    const now = new Date();
                    
                    // Check if the date is valid
                    if (isNaN(nextBillingDate.getTime())) return 30;
                    
                    const diffInMs = nextBillingDate.getTime() - now.getTime();
                    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
                    
                    // Ensure we return a reasonable value
                    return diffInDays > 0 ? Math.min(diffInDays, 365) : 30;
                  } catch (error) {
                    console.error('Error calculating days remaining:', error);
                    return 30;
                  }
                })()}
                onConfirm={handleConfirmCancellation}
                onCancel={() => {
                  setShowCancellationConfirmation(false);
                  setPlanToCancel(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Confirmation Popup */}
      {showUpgradeConfirmation && planToUpgrade && currentPlan && (
        <div className="subscription-popup-overlay">
          <div className="subscription-popup-container">
            <div className="subscription-popup-header">
              <h3>Confirm Plan Upgrade</h3>
              <button
                className="subscription-close-button"
                onClick={() => {
                  setShowUpgradeConfirmation(false);
                  setPlanToUpgrade(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="subscription-popup-content">
              <UpgradeConfirmation
                currentPlan={currentPlan}
                newPlan={(() => {
                  const basePlanId = planToUpgrade.replace('_annual', '');
                  const selectedPlan = PLANS.find(p => p.id === basePlanId);
                  if (!selectedPlan) {
                    throw new Error('Selected plan not found');
                  }
                  
                  return {
                    id: planToUpgrade,
                    name: selectedPlan.name,
                    amount: billingCycle === 'annual' ? selectedPlan.amount * 12 * (1 - ANNUAL_DISCOUNT_RATE) : selectedPlan.amount,
                    features: selectedPlan.features || []
                  };
                })()}
                daysRemaining={(() => {
                  if (!subscription?.nextBillingDate) {
                    // Default based on current plan's billing cycle
                    return currentPlan?.interval === 'year' ? 365 : 30;
                  }
                  
                  try {
                    const nextBillingDate = new Date(subscription.nextBillingDate);
                    const now = new Date();
                    
                    if (isNaN(nextBillingDate.getTime())) {
                      return currentPlan?.interval === 'year' ? 365 : 30;
                    }
                    
                    const diffInMs = nextBillingDate.getTime() - now.getTime();
                    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
                    
                    // Use current plan's billing cycle to determine max days
                    const maxDays = currentPlan?.interval === 'year' ? 365 : 30;
                    return diffInDays > 0 ? Math.min(diffInDays, maxDays) : maxDays;
                  } catch (error) {
                    console.error('Error calculating days remaining:', error);
                    return currentPlan?.interval === 'year' ? 365 : 30;
                  }
                })()}
                accountId={userDetails.accountId}
                onConfirm={handleConfirmUpgrade}
                onCancel={() => {
                  setShowUpgradeConfirmation(false);
                  setPlanToUpgrade(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Downgrade Confirmation Popup */}
      {showDowngradeConfirmation && planToDowngrade && currentPlan && (
        <div className="subscription-popup-overlay">
          <div className="subscription-popup-container">
            <div className="subscription-popup-header">
              <h3>Confirm Plan Downgrade</h3>
              <button
                className="subscription-close-button"
                onClick={() => {
                  setShowDowngradeConfirmation(false);
                  setPlanToDowngrade(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="subscription-popup-content">
              <DowngradeConfirmation
                currentPlan={currentPlan}
                newPlan={(() => {
                  const basePlanId = planToDowngrade.replace('_annual', '');
                  const selectedPlan = PLANS.find(p => p.id === basePlanId);
                  if (!selectedPlan) {
                    throw new Error('Selected plan not found');
                  }
                  
                  // FIXED: For downgrades, respect the user's choice of billing cycle
                  // The planToDowngrade already contains the correct billing cycle (_annual suffix or not)
                  const isAnnualPlan = planToDowngrade.includes('_annual');
                  const finalPlanId = planToDowngrade; // Use the exact plan ID that was selected
                  
                  return {
                    id: finalPlanId,
                    name: selectedPlan.name,
                    amount: isAnnualPlan ? selectedPlan.amount * 12 * (1 - ANNUAL_DISCOUNT_RATE) : selectedPlan.amount,
                    features: selectedPlan.features || []
                  };
                })()}
                daysRemaining={(() => {
                  if (!subscription?.nextBillingDate) {
                    // Default based on current plan's billing cycle
                    return currentPlan?.interval === 'year' ? 365 : 30;
                  }
                  
                  try {
                    const nextBillingDate = new Date(subscription.nextBillingDate);
                    const now = new Date();
                    
                    if (isNaN(nextBillingDate.getTime())) {
                      return currentPlan?.interval === 'year' ? 365 : 30;
                    }
                    
                    const diffInMs = nextBillingDate.getTime() - now.getTime();
                    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
                    
                    // Use current plan's billing cycle to determine max days
                    const maxDays = currentPlan?.interval === 'year' ? 365 : 30;
                    return diffInDays > 0 ? Math.min(diffInDays, maxDays) : maxDays;
                  } catch (error) {
                    console.error('Error calculating days remaining:', error);
                    return currentPlan?.interval === 'year' ? 365 : 30;
                  }
                })()}
                accountId={userDetails.accountId}
                onConfirm={handleConfirmDowngrade}
                onCancel={() => {
                  setShowDowngradeConfirmation(false);
                  setPlanToDowngrade(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans; 