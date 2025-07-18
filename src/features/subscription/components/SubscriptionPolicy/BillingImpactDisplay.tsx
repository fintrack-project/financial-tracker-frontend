import React from 'react';
import { BillingImpactDisplayProps } from '../../types';
import './BillingImpactDisplay.css';

const BillingImpactDisplay: React.FC<BillingImpactDisplayProps> = ({
  billingImpact,
  className = ''
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getImpactType = (): 'increase' | 'decrease' | 'no-change' => {
    if (Math.abs(billingImpact.totalImpact) < 0.01) return 'no-change';
    return billingImpact.totalImpact > 0 ? 'increase' : 'decrease';
  };

  const getImpactColor = (): string => {
    const type = getImpactType();
    switch (type) {
      case 'decrease': return '#28a745';
      case 'increase': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const impactType = getImpactType();
  const impactColor = getImpactColor();

  return (
    <div className={`billing-impact-display ${className}`}>
      <h3 className="impact-title">Billing Impact Summary</h3>
      
      <div className="impact-summary">
        <div className="summary-card current-plan">
          <h4 className="card-title">Current Plan</h4>
          <div className="card-content">
            <div className="amount">{formatCurrency(billingImpact.currentAmount)}</div>
            <div className="period">per month</div>
          </div>
        </div>

        <div className="summary-card new-plan">
          <h4 className="card-title">New Plan</h4>
          <div className="card-content">
            <div className="amount">{formatCurrency(billingImpact.newAmount)}</div>
            <div className="period">per month</div>
          </div>
        </div>
      </div>

      <div className="impact-details">
        <div className="detail-row">
          <span className="detail-label">Days Remaining:</span>
          <span className="detail-value">{billingImpact.daysRemaining} days</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Proration Amount:</span>
          <span 
            className="detail-value proration-amount"
            style={{ color: billingImpact.prorationAmount > 0 ? '#dc3545' : '#28a745' }}
          >
            {billingImpact.prorationAmount > 0 ? '+' : ''}{formatCurrency(billingImpact.prorationAmount)}
          </span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Next Billing:</span>
          <span className="detail-value">{formatCurrency(billingImpact.nextBillingAmount)}</span>
        </div>
      </div>

      <div className="total-impact" style={{ borderColor: impactColor }}>
        <div className="impact-header">
          <span className="impact-label">Total Impact:</span>
          <span 
            className="impact-value"
            style={{ color: impactColor }}
          >
            {impactType === 'no-change' 
              ? 'No change'
              : `${impactType === 'increase' ? '+' : '-'}${formatCurrency(Math.abs(billingImpact.totalImpact))}`
            }
          </span>
        </div>
        
        {billingImpact.savings > 0 && (
          <div className="savings-info">
            <span className="savings-label">Annual Savings:</span>
            <span className="savings-value" style={{ color: '#28a745' }}>
              {formatCurrency(billingImpact.savings)}
            </span>
          </div>
        )}
      </div>

      <div className="impact-note">
        <p>
          {impactType === 'increase' && (
            <>Your monthly billing will increase by {formatCurrency(billingImpact.totalImpact)}.</>
          )}
          {impactType === 'decrease' && (
            <>Your monthly billing will decrease by {formatCurrency(Math.abs(billingImpact.totalImpact))}.</>
          )}
          {impactType === 'no-change' && (
            <>No change to your monthly billing amount.</>
          )}
          {billingImpact.savings > 0 && (
            <> You'll save {formatCurrency(billingImpact.savings)} annually with this change.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default BillingImpactDisplay; 