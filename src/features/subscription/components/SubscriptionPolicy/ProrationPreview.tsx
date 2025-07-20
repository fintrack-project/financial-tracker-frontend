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

  useEffect(() => {
    calculateProration();
  }, [fromPlanId, toPlanId, daysRemaining, currentAmount, newAmount]);

  const calculateProration = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use our API client to get the exact proration calculation
      const calculation = await subscriptionPolicyApi.calculateProration(
        fromPlanId,
        toPlanId,
        daysRemaining
      );
      
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

  if (loading) {
    return (
      <div className={`proration-preview loading ${className}`}>
        <div className="loading-spinner"></div>
        <p>Calculating exact amount...</p>
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
      </div>
    );
  }

  if (!calculation) {
    return null;
  }

  const isCredit = calculation.prorationType === 'credit';
  const isCharge = calculation.prorationType === 'charge';

  return (
    <div className={`proration-preview ${className}`}>
      <h3 className="preview-title">Exact Amount You'll Pay</h3>
      
      <div className="amount-breakdown">
        <div className="breakdown-item">
          <span className="label">Full New Plan:</span>
          <span className="value">{formatCurrency(calculation.newAmount)}</span>
        </div>
        
        <div className="breakdown-item credit">
          <span className="label">Credit for Unused Time:</span>
          <span className="value">-{formatCurrency(Math.abs(calculation.prorationAmount))}</span>
        </div>
        
        <div className="breakdown-item total">
          <span className="label">Amount Due Today:</span>
          <span className="value total-amount">{formatCurrency(calculation.totalImpact)}</span>
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