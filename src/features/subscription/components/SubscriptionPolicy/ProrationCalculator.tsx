import React, { useState, useEffect } from 'react';
import { ProrationCalculatorProps } from '../../types';
import { subscriptionPolicyApi } from '../../api';
import './ProrationCalculator.css';

const ProrationCalculator: React.FC<ProrationCalculatorProps> = ({
  fromPlanId,
  toPlanId,
  daysRemaining,
  currentAmount,
  newAmount,
  className = ''
}) => {
  const [prorationAmount, setProrationAmount] = useState<number>(0);
  const [nextBillingAmount, setNextBillingAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateProration();
  }, [fromPlanId, toPlanId, daysRemaining, currentAmount, newAmount]);

  const calculateProration = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate basic proration
      const dailyRate = currentAmount / 30; // Assuming 30-day billing cycle
      const prorationCredit = dailyRate * daysRemaining;
      
      // Calculate new proration
      const newDailyRate = newAmount / 30;
      const newProrationCharge = newDailyRate * daysRemaining;
      
      const finalProration = newProrationCharge - prorationCredit;
      const finalNextBilling = newAmount;

      setProrationAmount(finalProration);
      setNextBillingAmount(finalNextBilling);

      // Optionally call backend API for more complex calculations
      try {
        const calculation = await subscriptionPolicyApi.calculateProration(
          fromPlanId,
          toPlanId,
          daysRemaining,
          finalProration,
          finalNextBilling
        );
        
        // Use backend calculation if available
        setProrationAmount(calculation.prorationAmount);
        setNextBillingAmount(calculation.nextBillingAmount);
      } catch (apiError) {
        // Fall back to frontend calculation
        console.warn('Backend proration calculation failed, using frontend calculation');
      }
    } catch (err) {
      console.error('Error calculating proration:', err);
      setError('Failed to calculate proration');
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

  const getProrationType = (): 'credit' | 'charge' | 'none' => {
    if (Math.abs(prorationAmount) < 0.01) return 'none';
    return prorationAmount > 0 ? 'charge' : 'credit';
  };

  const getProrationColor = (): string => {
    const type = getProrationType();
    switch (type) {
      case 'credit': return '#28a745';
      case 'charge': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className={`proration-calculator loading ${className}`}>
        <div className="calculator-loading">
          <div className="loading-spinner"></div>
          <p>Calculating proration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`proration-calculator error ${className}`}>
        <div className="calculator-error">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
          <button onClick={calculateProration} className="retry-button">
            Recalculate
          </button>
        </div>
      </div>
    );
  }

  const prorationType = getProrationType();
  const prorationColor = getProrationColor();

  return (
    <div className={`proration-calculator ${className}`}>
      <h3 className="calculator-title">Proration Calculation</h3>
      
      <div className="calculation-summary">
        <div className="summary-row">
          <span className="summary-label">Current Plan:</span>
          <span className="summary-value">{formatCurrency(currentAmount)}/month</span>
        </div>
        
        <div className="summary-row">
          <span className="summary-label">New Plan:</span>
          <span className="summary-value">{formatCurrency(newAmount)}/month</span>
        </div>
        
        <div className="summary-row">
          <span className="summary-label">Days Remaining:</span>
          <span className="summary-value">{daysRemaining} days</span>
        </div>
      </div>

      <div className="proration-result">
        <div className="result-row">
          <span className="result-label">Proration Amount:</span>
          <span 
            className="result-value proration-amount"
            style={{ color: prorationColor }}
          >
            {prorationType === 'none' 
              ? 'No proration'
              : `${prorationType === 'credit' ? '-' : '+'}${formatCurrency(Math.abs(prorationAmount))}`
            }
          </span>
        </div>
        
        <div className="result-row">
          <span className="result-label">Next Billing:</span>
          <span className="result-value next-billing">
            {formatCurrency(nextBillingAmount)}
          </span>
        </div>
      </div>

      <div className="calculation-note">
        <p>
          {prorationType === 'credit' && (
            <>You will receive a credit of {formatCurrency(Math.abs(prorationAmount))} for unused time.</>
          )}
          {prorationType === 'charge' && (
            <>You will be charged {formatCurrency(prorationAmount)} for the upgrade.</>
          )}
          {prorationType === 'none' && (
            <>No proration adjustment needed.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProrationCalculator; 