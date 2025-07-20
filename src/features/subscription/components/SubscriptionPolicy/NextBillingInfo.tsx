import React from 'react';
import { NextBillingInfoProps } from '../../types';
import './NextBillingInfo.css';
import '../../../profile/components/Profile/AccountTier.css';

// Utility function to map plan names to tier classes
const getTierClass = (planName: string): string => {
  // Remove "Annual" suffix and convert to lowercase for comparison
  const cleanPlanName = planName.replace(/\s*annual\s*/i, '').toLowerCase();
  
  if (cleanPlanName === 'free') return 'free';
  if (cleanPlanName === 'basic') return 'basic';
  if (cleanPlanName === 'premium') return 'premium';
  return 'free'; // Default to free tier styling
};

const NextBillingInfo: React.FC<NextBillingInfoProps> = ({
  currentPlan,
  newPlan,
  nextBillingDate,
  nextBillingAmount,
  className = ''
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilBilling = (): number => {
    const today = new Date();
    const billingDate = new Date(nextBillingDate);
    const diffTime = billingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysUntilBilling = getDaysUntilBilling();

  return (
    <div className={`next-billing-info ${className}`}>
      <h3 className="billing-title">Next Billing Information</h3>
      
      <div className="billing-summary">
        <div className="plan-change">
          <div className="plan-badges">
            <span className={`account-tier ${getTierClass(currentPlan)}`}>{currentPlan}</span>
            <span className="plan-arrow">→</span>
            <span className={`account-tier ${getTierClass(newPlan)}`}>{newPlan}</span>
          </div>
        </div>
      </div>

      <div className="billing-details">
        <div className="detail-item">
          <div className="detail-icon">📅</div>
          <div className="detail-content">
            <span className="detail-label">Next Billing Date:</span>
            <span className="detail-value">{formatDate(nextBillingDate)}</span>
            {daysUntilBilling > 0 && (
              <span className="days-remaining">({daysUntilBilling} days from now)</span>
            )}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">💰</div>
          <div className="detail-content">
            <span className="detail-label">Next Billing Amount:</span>
            <span className="detail-value billing-amount">{formatCurrency(nextBillingAmount)}</span>
          </div>
        </div>
      </div>

      <div className="billing-note">
        <div className="note-icon">ℹ️</div>
        <div className="note-content">
          <p>
            Your subscription will be updated immediately, and you'll be billed the new amount 
            on your next billing date. Stripe will handle any proration adjustments automatically.
          </p>
        </div>
      </div>

      {daysUntilBilling <= 7 && (
        <div className="billing-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <p>
              <strong>Upcoming billing:</strong> Your next billing date is in {daysUntilBilling} day{daysUntilBilling !== 1 ? 's' : ''}. 
              Make sure your payment method is up to date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextBillingInfo; 