import React, { useState, useEffect, useCallback } from 'react';
import { SubscriptionPolicy, PolicyAcceptanceRequest } from '../../types';
import { subscriptionPolicyApi } from '../../api/subscriptionPolicyApi';
import NextBillingInfo from './NextBillingInfo';
import ProrationPreview from './ProrationPreview';
import './DowngradeConfirmation.css';

interface DowngradeConfirmationProps {
  currentPlan: {
    id: string;
    name: string;
    amount: number;
    features: string[];
  };
  newPlan: {
    id: string;
    name: string;
    amount: number;
    features: string[];
  };
  daysRemaining: number;
  accountId: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

const DowngradeConfirmation: React.FC<DowngradeConfirmationProps> = ({
  currentPlan,
  newPlan,
  daysRemaining,
  accountId,
  onConfirm,
  onCancel,
  className = ''
}) => {
  const [policy, setPolicy] = useState<SubscriptionPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(false);
  const [showWarnings, setShowWarnings] = useState(true);

  const loadPolicy = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load downgrade policy
      const downgradePolicy = await subscriptionPolicyApi.getCurrentPolicy('downgrade');
      setPolicy(downgradePolicy);

      // Check if user has already accepted this policy version
      const accepted = await subscriptionPolicyApi.checkPolicyAcceptance(
        accountId,
        'downgrade',
        downgradePolicy.version
      );
      setHasAcceptedPolicy(accepted);
    } catch (err) {
      console.error('Error loading policy:', err);
      setError('Failed to load downgrade policy');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadPolicy();
  }, [loadPolicy]);

  const handleAcceptPolicy = async () => {
    if (!policy) return;

    try {
      const request: PolicyAcceptanceRequest = {
        accountId,
        policyVersion: policy.version,
        policyType: 'downgrade',
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent
      };

      await subscriptionPolicyApi.acceptPolicy(request);
      setHasAcceptedPolicy(true);

      // Record the subscription change
      await subscriptionPolicyApi.recordSubscriptionChange({
        accountId,
        changeType: 'downgrade',
        fromPlanId: currentPlan.id,
        toPlanId: newPlan.id,
        policyVersion: policy.version,
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent
      });

      await onConfirm();
    } catch (err) {
      console.error('Error accepting policy:', err);
      setError('Failed to accept policy');
    }
  };

  const handleConfirm = async () => {
    if (!policy) return;

    try {
      const request: PolicyAcceptanceRequest = {
        accountId,
        policyVersion: policy.version,
        policyType: 'downgrade',
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent
      };

      await subscriptionPolicyApi.acceptPolicy(request);
      setHasAcceptedPolicy(true);

      // Record the subscription change
      await subscriptionPolicyApi.recordSubscriptionChange({
        accountId,
        changeType: 'downgrade',
        fromPlanId: currentPlan.id,
        toPlanId: newPlan.id,
        policyVersion: policy.version,
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent
      });

      await onConfirm();
    } catch (err) {
      console.error('Error confirming downgrade:', err);
      setError('Failed to confirm downgrade');
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
      <div className={`downgrade-confirmation loading ${className}`}>
        <div className="loading-spinner"></div>
        <p>Loading downgrade confirmation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`downgrade-confirmation error ${className}`}>
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
          <button onClick={loadPolicy} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`downgrade-confirmation ${className}`}>
      <div className="confirmation-header">
        <h2>Confirm Plan Downgrade</h2>
        <p>You're about to downgrade from {currentPlan.name} to {newPlan.name}</p>
      </div>

      {showWarnings && (
        <div className="warnings-section">
          <div className="warning-card">
            <h3>⚠️ Important Changes</h3>
            <ul>
              <li>You'll lose access to premium features</li>
              <li>Your data limits will be reduced</li>
              <li>Changes take effect at the end of your current billing period</li>
            </ul>
            <button onClick={() => setShowWarnings(false)} className="acknowledge-button">
              I Understand
            </button>
          </div>
        </div>
      )}

      {!showWarnings && (
        <>
          <div className="plan-comparison">
            <div className="plan-card current">
              <h3 className="plan-name">{currentPlan.name}</h3>
              <div className="plan-price">{formatCurrency(currentPlan.amount)}/month</div>
              <ul className="plan-features">
                {currentPlan.features.slice(0, 3).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="downgrade-arrow">→</div>

            <div className="plan-card new">
              <h3 className="plan-name">{newPlan.name}</h3>
              <div className="plan-price">{formatCurrency(newPlan.amount)}/month</div>
              <ul className="plan-features">
                {newPlan.features.slice(0, 3).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="billing-info-section">
            <NextBillingInfo
              currentPlan={currentPlan.name}
              newPlan={newPlan.name}
              nextBillingDate={new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toISOString()}
              nextBillingAmount={newPlan.amount}
            />
          </div>

          <div className="proration-preview-section">
            <ProrationPreview
              fromPlanId={currentPlan.id}
              toPlanId={newPlan.id}
              daysRemaining={daysRemaining}
              currentAmount={currentPlan.amount}
              newAmount={newPlan.amount}
            />
          </div>

          {policy && !hasAcceptedPolicy && (
            <div className="policy-section">
              <div className="policy-content">
                <h3>Downgrade Policy</h3>
                <div className="policy-text" dangerouslySetInnerHTML={{ __html: policy.content }} />
              </div>
              <button onClick={handleAcceptPolicy} className="accept-policy-button">
                I Accept the Downgrade Policy
              </button>
            </div>
          )}

          <div className="confirmation-note">
            <p>
              <strong>Note:</strong> Your downgrade will take effect at the end of your current billing period. 
              You'll continue to have access to your current plan features until then.
            </p>
          </div>

          <div className="confirmation-actions">
            <button onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button 
              onClick={handleConfirm} 
              className="confirm-button"
              disabled={!!(policy && !hasAcceptedPolicy)}
            >
              Confirm Downgrade
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DowngradeConfirmation; 