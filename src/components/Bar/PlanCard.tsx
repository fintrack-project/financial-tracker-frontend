import React from 'react';
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import './PlanCard.css';

interface Plan {
  id: string;
  name: string;
  price: number;
  color: string;
  features: string[];
}

interface PlanCardProps {
  plan: Plan;
  loading: boolean;
  currentPlan: SubscriptionPlan | null;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  loading, 
  currentPlan, 
  onSelect 
}) => {
  const isCurrentPlan = currentPlan && plan.id === currentPlan.name.toLowerCase();

  return (
    <div
      className={`plan-card ${isCurrentPlan ? 'current-plan' : ''}`}
      style={{ borderColor: plan.color }}
    >
      {isCurrentPlan && (
        <div className="current-plan-badge">
          Current Plan
        </div>
      )}
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
        onClick={() => onSelect(plan.id)}
        disabled={!!(loading || isCurrentPlan)}
      >
        {loading ? 'Loading...' : isCurrentPlan ? 'Current Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

export default PlanCard; 