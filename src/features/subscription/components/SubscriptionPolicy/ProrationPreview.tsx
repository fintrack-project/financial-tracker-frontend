import React, { useState, useEffect, useCallback } from 'react';
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

  const calculateProration = useCallback(async () => {
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
  }, [fromPlanId, toPlanId, daysRemaining]);

  useEffect(() => {
    calculateProration();
  }, [calculateProration]);

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

  // Removed unused variables for simplicity

  // Determine if this is a credit or charge based on total impact
  const isCredit = calculation.totalImpact < 0;
  const hasCredit = calculation.totalImpact < calculation.newAmount;

  return (
    <div className={`proration-preview ${className}`}>
      <h3 className="preview-title">Proration Breakdown</h3>
      
      {/* Credit/Charge Summary */}
      {isCredit && (
        <div className="credit-summary">
          <div className="credit-badge">
            <span className="credit-icon">💰</span>
            <span className="credit-text">You'll receive {formatCurrency(Math.abs(calculation.totalImpact))} credit!</span>
          </div>
        </div>
      )}
      
      {/* Detailed breakdown */}
      <div className="amount-breakdown">
        <div className="breakdown-item">
          <span className="label">New Plan Full Price:</span>
          <span className="value">{formatCurrency(calculation.newAmount)}</span>
        </div>
        
        {calculation.prorationAmount < 0 && (
          <div className="breakdown-item credit">
            <span className="label">Credit for Unused Time ({daysRemaining} days):</span>
            <span className="value credit-amount">-{formatCurrency(Math.abs(calculation.prorationAmount))}</span>
          </div>
        )}
        
        {calculation.prorationAmount > 0 && (
          <div className="breakdown-item charge">
            <span className="label">Additional Charge for Unused Time ({daysRemaining} days):</span>
            <span className="value charge-amount">+{formatCurrency(calculation.prorationAmount)}</span>
          </div>
        )}
        
        <div className="breakdown-item total">
          <span className="label">
            {hasCredit ? 'Amount Due Today:' : 'Total Amount Due Today:'}
          </span>
          <span className={`value total-amount ${hasCredit ? 'reduced' : ''}`}>
            {hasCredit ? formatCurrency(calculation.totalImpact) : formatCurrency(calculation.totalImpact)}
          </span>
        </div>
        
        {hasCredit && (
          <div className="savings-note">
            <span className="savings-icon">💡</span>
            <span className="savings-text">
              You're saving {formatCurrency(Math.abs(calculation.newAmount - calculation.totalImpact))} today!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProrationPreview; 