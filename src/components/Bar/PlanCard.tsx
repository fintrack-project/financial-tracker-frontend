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
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, loading, currentPlan, onSelect }) => {
  const isCurrentPlanGroup = currentPlan?.plan_group_id === plan.plan_group_id;
  const price = plan.isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const savings = ANNUAL_DISCOUNT_RATE * 100;

  return (
    <div className={`plan-card ${isCurrentPlanGroup ? 'current' : ''}`}>
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
        className={`plan-button ${isCurrentPlanGroup ? 'secondary' : 'primary'} ${loading ? 'disabled' : ''}`}
        onClick={() => onSelect(plan.id)}
        disabled={loading || isCurrentPlanGroup}
      >
        {loading ? 'Loading...' : isCurrentPlanGroup ? 'Current Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

export default PlanCard; 