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
  onCancel: (planId: string) => void;
  onUpgrade: (planId: string) => void;
  onDowngrade: (planId: string) => void;
}

const handleButtonClick = async ({
  onCancel,
  onUpgrade,
  onDowngrade,
  displayCancelButton,
  displayUpgradeButton,
  displayDowngradeButton,
  displayCurrentPlanButton,
  planId
} : {
  onCancel: (planId: string) => void,
  onUpgrade: (planId: string) => void,
  onDowngrade: (planId: string) => void,
  displayCancelButton: boolean,
  displayUpgradeButton: boolean,
  displayDowngradeButton: boolean,
  displayCurrentPlanButton: boolean,
  planId: string
}) => {
  if (displayCancelButton && onCancel) {
    await onCancel(planId);
  } else if (displayUpgradeButton && onUpgrade) {
    await onUpgrade(planId);
  } else if (displayDowngradeButton && onDowngrade) {
    await onDowngrade(planId);
  }
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, loading, currentPlan, onCancel, onUpgrade, onDowngrade }) => {
  const isCurrentFreePlan = currentPlan?.plan_group_id === 'free';
  const isFreePlan = plan.plan_group_id === 'free';
  const isBetterPlan = 
    ((plan.plan_group_id === 'premium') && (currentPlan?.plan_group_id === 'basic' || currentPlan?.plan_group_id === 'free')) ||
    ((plan.plan_group_id === 'basic') && (currentPlan?.plan_group_id === 'free'));
  const isCurrentPlanGroupId = currentPlan?.plan_group_id === plan.plan_group_id;
  const isSameBillingCycle = (currentPlan?.interval === 'year' && plan.isAnnual) || (currentPlan?.interval === 'month' && !plan.isAnnual);
  const displayUpgradeButton = (isBetterPlan || !isCurrentFreePlan && (isCurrentPlanGroupId && (currentPlan?.interval === 'month' && plan.isAnnual)));
  const displayCancelButton = !isCurrentFreePlan && (isCurrentPlanGroupId && isSameBillingCycle);
  const displayCurrentPlanButton = (isCurrentFreePlan && isFreePlan) || (!isCurrentFreePlan && (isCurrentPlanGroupId && (currentPlan?.interval === 'year' && !plan.isAnnual)));
  const displayDowngradeButton = !isCurrentFreePlan && !isBetterPlan;
  const price = plan.isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const savings = ANNUAL_DISCOUNT_RATE * 100;

  return (
    <div className={`plan-card ${isCurrentPlanGroupId ? 'current' : ''}`}>
      <div className="plan-header">
        <h3 className="plan-name" style={{ color: plan.color }}>{plan.name}</h3>
        <div className="plan-price">
          ${price}
          <span className="period">/{plan.isAnnual ? 'year' : 'month'}</span>
          {plan.isAnnual && savings > 0 && (
            <span className="savings">Save {savings}% with annual billing</span>
          )}
        </div>
      </div>

      <ul className="plan-features">
        {plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <button
        className={`plan-button 
          ${displayUpgradeButton ? 'primary' : displayCurrentPlanButton || displayDowngradeButton || displayCancelButton ? 'secondary' : 'primary'}
          ${loading ? 'disabled' : ''}`}
        onClick={() => handleButtonClick({
          onCancel: () => onCancel(plan.id), 
          onUpgrade: () => onUpgrade(plan.id), 
          onDowngrade: () => onDowngrade(plan.id),
          displayCancelButton,
          displayUpgradeButton,
          displayDowngradeButton,
          displayCurrentPlanButton,
          planId: plan.id
        })}
        disabled={loading || displayCurrentPlanButton}
      >
        {loading ? 'Loading...' : 
        displayCurrentPlanButton ? 'Current Plan' : 
        displayCancelButton ? 'Cancel Plan' :
        displayUpgradeButton ? 'Upgrade Plan' : 
        displayDowngradeButton ? 'Downgrade Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

export default PlanCard; 