import React from 'react';
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import { ANNUAL_DISCOUNT_RATE } from './Plans';
import './PlanCard.css';

interface Plan {
  id: string;
  plan_group_id: string;
  name: string;
  color: string;
  features: string[];
  monthlyPrice: number;
  annualPrice: number;
  isAnnual: boolean;
}

interface PlanCardProps {
  plan: Plan;
  loading: boolean;
  currentPlan: SubscriptionPlan | null;
  isCancelling: boolean;
  onCancel: (planId: string) => void;
  onUpgrade: (planId: string) => void;
  onDowngrade: (planId: string) => void;
  onReactivate: (planId: string) => void;
}

const handleButtonClick = async ({
  onCancel,
  onUpgrade,
  onDowngrade,
  onReactivate,
  displayCancelButton,
  displayUpgradeButton,
  displayDowngradeButton,
  displayReactivateButton,
  planId
} : {
  onCancel: (planId: string) => void,
  onUpgrade: (planId: string) => void,
  onDowngrade: (planId: string) => void,
  onReactivate: (planId: string) => void,
  displayCancelButton: boolean,
  displayUpgradeButton: boolean,
  displayDowngradeButton: boolean,
  displayReactivateButton: boolean,
  planId: string
}) => {
  if (displayCancelButton && onCancel) {
    await onCancel(planId);
  } else if (displayUpgradeButton && onUpgrade) {
    await onUpgrade(planId);
  } else if (displayDowngradeButton && onDowngrade) {
    await onDowngrade(planId);
  } else if (displayReactivateButton && onReactivate) {
    await onReactivate(planId);
  }
};

export const handleButtonDisplay = (
  { plan,
    currentPlan,
    isCancelling
  }: {
    plan: Plan,
    currentPlan: SubscriptionPlan | null,
    isCancelling: boolean
  }
) => {
  const isCurrentFreePlan = currentPlan?.plan_group_id === 'free';
  const isFreePlan = plan.plan_group_id === 'free';
  const isBetterPlan = 
    ((plan.plan_group_id === 'premium') && ((currentPlan?.plan_group_id === 'basic') || (currentPlan?.plan_group_id === 'free'))) ||
    ((plan.plan_group_id === 'basic') && (currentPlan?.plan_group_id === 'free'));
  const isCurrentPlanGroupId = currentPlan?.plan_group_id === plan.plan_group_id;
  const isSameBillingCycle = ((currentPlan?.interval === 'year') && plan.isAnnual) || ((currentPlan?.interval === 'month') && !plan.isAnnual);

  const displayUpgradeButton = (isBetterPlan || (!isCurrentFreePlan && (isCurrentPlanGroupId && ((currentPlan?.interval === 'month') && plan.isAnnual))));
  const displayCancelButton = !isCancelling && (!isCurrentFreePlan && (isCurrentPlanGroupId && isSameBillingCycle));
  const displayReactivateButton = isCancelling && (!isCurrentFreePlan && (isCurrentPlanGroupId && isSameBillingCycle));
  const displayCurrentPlanButton = (isCurrentFreePlan && isFreePlan) || (!isCurrentFreePlan && (isCurrentPlanGroupId && ((currentPlan?.interval === 'year') && !plan.isAnnual)));
  const displayDowngradeButton = !isCurrentFreePlan && (plan.plan_group_id === 'basic' && currentPlan?.plan_group_id === 'premium');

  return {
    displayUpgradeButton,
    displayCancelButton,
    displayReactivateButton,
    displayCurrentPlanButton,
    displayDowngradeButton
  }
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, loading, currentPlan, onCancel, onUpgrade, onDowngrade, onReactivate, isCancelling }) => {
  const isCurrentPlanGroupId = currentPlan?.plan_group_id === plan.plan_group_id;
  const { 
    displayUpgradeButton, 
    displayCancelButton, 
    displayReactivateButton, 
    displayCurrentPlanButton, 
    displayDowngradeButton 
  } = handleButtonDisplay({ plan, currentPlan, isCancelling });
  const price = plan.isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const savings = ANNUAL_DISCOUNT_RATE * 100;

  return (
    <div className={`plan-card ${isCurrentPlanGroupId ? 'current' : ''}`}>
      <div className="plan-card-header">
        <h3 className="plan-card-name" style={{ color: plan.color }}>{plan.name}</h3>
        <div className="plan-card-price">
          ${price}
          <span className="period">/{plan.isAnnual ? 'year' : 'month'}</span>
          {plan.isAnnual && savings > 0 && (
            <span className="savings">Save {savings}% with annual billing</span>
          )}
        </div>
      </div>

      <ul className="plan-card-features">
        {plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <button
        className={`select-plan-button 
          ${displayUpgradeButton || displayReactivateButton ? 'primary' : displayCurrentPlanButton || displayDowngradeButton || displayCancelButton ? 'secondary' : 'primary'}
          ${loading ? 'disabled' : ''}`}
        onClick={() => handleButtonClick({
          onCancel: () => onCancel(plan.id), 
          onUpgrade: () => onUpgrade(plan.id), 
          onDowngrade: () => onDowngrade(plan.id),
          onReactivate: () => onReactivate(plan.id),
          displayCancelButton,
          displayUpgradeButton,
          displayDowngradeButton,
          displayReactivateButton,
          planId: plan.id
        })}
        disabled={loading || displayCurrentPlanButton}
      >
        {loading ? 'Loading...' : 
        displayCurrentPlanButton ? 'Current Plan' : 
        displayCancelButton ? 'Cancel Plan' : 
        displayReactivateButton ? 'Reactivate Plan' :
        displayUpgradeButton ? 'Upgrade Plan' : 
        displayDowngradeButton ? 'Downgrade Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

export default PlanCard; 