import React from 'react';
import { UserDetails } from '../../types/UserDetails';
import { UserSubscription } from '../../types/UserSubscription';
import './Plans.css';

interface PlansProps {
  userDetails: UserDetails;
  subscription: UserSubscription | null;
}

const Plans: React.FC<PlansProps> = ({ userDetails, subscription }) => {
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

  return (
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
          >
            {plan.name.toLowerCase() === userDetails.accountTier.toLowerCase() ? 'Current Plan' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Plans; 