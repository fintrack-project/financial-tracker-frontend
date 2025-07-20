import React, { useState, useEffect } from 'react';
import { subscriptionPolicyApi, ProrationCalculation } from '../../api/subscriptionPolicyApi';
import './ProrationPreview.css';

interface ProrationPreviewProps {
  fromPlanId: string;
  toPlanId: string;
  daysRemaining: number;
  currentAmount: number;
  newAmount: number;
  className?: string;
}

const ProrationPreview: React.FC<ProrationPreviewProps> = ({
  fromPlanId,
  toPlanId,
  daysRemaining,
  currentAmount,
  newAmount,
  className = ''
}) => {
  const [calculation, setCalculation] = useState<ProrationCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging to help identify issues
  useEffect(() => {
    console.log('ProrationPreview props:', {
      fromPlanId,
      toPlanId,
      daysRemaining,
      currentAmount,
      newAmount
    });
  }, [fromPlanId, toPlanId, daysRemaining, currentAmount, newAmount]);

  useEffect(() => {
    calculateProration();
  }, [fromPlanId, toPlanId, daysRemaining, currentAmount, newAmount]);

  const calculateProration = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Calculating proration for:', {
        fromPlanId,
        toPlanId,
        daysRemaining
      });

      // Use our API client to get the exact proration calculation
      const calculation = await subscriptionPolicyApi.calculateProration(
        fromPlanId,
        toPlanId,
        daysRemaining
      );
      
      console.log('Proration calculation result:', calculation);
      setCalculation(calculation);
    } catch (err) {
      console.error('Error calculating proration:', err);
      setError('Unable to calculate exact amount');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Always render the component to help with debugging
  if (loading) {
    return (
      <div className={`proration-preview loading ${className}`}>
        <div className="loading-spinner"></div>
        <p>Calculating exact amount...</p>
        <p className="debug-info">Debug: Loading proration calculation</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`proration-preview error ${className}`}>
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
          <button onClick={calculateProration} className="retry-button">
            Retry
          </button>
        </div>
        <p className="debug-info">Debug: Error occurred during calculation</p>
      </div>
    );
  }

  if (!calculation) {
    return (
      <div className={`proration-preview ${className}`}>
        <p className="debug-info">Debug: No calculation data available</p>
        <button onClick={calculateProration} className="retry-button">
          Calculate Proration
        </button>
      </div>
    );
  }

  const isCredit = calculation.prorationType === 'credit';
  const isCharge = calculation.prorationType === 'charge';

  return (
    <div className={`proration-preview ${className}`}>
      <h3 className="preview-title">Your Upgrade Summary</h3>
      
      {/* What you already paid */}
      <div className="payment-summary">
        <div className="summary-section">
          <h4 className="section-title">What You Already Paid</h4>
          <div className="summary-item">
            <span className="label">Current Plan Payment:</span>
            <span className="value already-paid">{formatCurrency(currentAmount)}</span>
          </div>
          <div className="summary-note">
            <i className="note-icon">✓</i>
            <span>You've already paid this amount for your current plan</span>
          </div>
        </div>

        {/* What you need to pay now */}
        <div className="summary-section">
          <h4 className="section-title">What You'll Pay Today</h4>
          <div className="summary-item">
            <span className="label">Proration Amount:</span>
            <span className="value proration-amount">{formatCurrency(calculation.totalImpact)}</span>
          </div>
          <div className="summary-note">
            <i className="note-icon">💳</i>
            <span>This is the additional amount to upgrade to your new plan</span>
          </div>
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="amount-breakdown">
        <h4 className="breakdown-title">Detailed Breakdown</h4>
        
        <div className="breakdown-item">
          <span className="label">New Plan Full Price:</span>
          <span className="value">{formatCurrency(calculation.newAmount)}</span>
        </div>
        
        <div className="breakdown-item credit">
          <span className="label">Credit for Unused Time ({daysRemaining} days):</span>
          <span className="value">-{formatCurrency(Math.abs(calculation.prorationAmount))}</span>
        </div>
        
        <div className="breakdown-item total">
          <span className="label">Total Amount Due Today:</span>
          <span className="value total-amount">{formatCurrency(calculation.totalImpact)}</span>
        </div>
      </div>

      {/* Total cost summary */}
      <div className="total-cost-summary">
        <div className="total-cost-item">
          <span className="label">Already Paid:</span>
          <span className="value">{formatCurrency(currentAmount)}</span>
        </div>
        <div className="total-cost-item">
          <span className="label">Paying Today:</span>
          <span className="value">{formatCurrency(calculation.totalImpact)}</span>
        </div>
        <div className="total-cost-item total">
          <span className="label">Total Investment:</span>
          <span className="value">{formatCurrency(currentAmount + calculation.totalImpact)}</span>
        </div>
      </div>

      <div className="proration-note">
        <div className="note-icon">ℹ️</div>
        <div className="note-content">
          <p>
            <strong>Transparent Pricing:</strong> You'll be charged exactly {formatCurrency(calculation.totalImpact)} today. 
            This includes credit for your unused {daysRemaining} days on your current plan.
          </p>
        </div>
      </div>

      {calculation.savings > 0 && (
        <div className="savings-info">
          <div className="savings-icon">💰</div>
          <div className="savings-content">
            <p>
              <strong>You're saving {formatCurrency(calculation.savings)}</strong> compared to paying full price for both plans.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProrationPreview; 