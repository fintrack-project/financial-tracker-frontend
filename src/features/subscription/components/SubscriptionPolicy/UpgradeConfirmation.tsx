import React, { useState, useEffect, useCallback } from 'react';
import { SubscriptionPolicy, PolicyAcceptanceRequest } from '../../types';
import { subscriptionPolicyApi } from '../../api/subscriptionPolicyApi';
import NextBillingInfo from './NextBillingInfo';
import ProrationPreview from './ProrationPreview';
import './UpgradeConfirmation.css';

interface UpgradeConfirmationProps {
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

const UpgradeConfirmation: React.FC<UpgradeConfirmationProps> = ({
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

  const loadPolicy = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load upgrade policy
      const upgradePolicy = await subscriptionPolicyApi.getCurrentPolicy('upgrade');
      setPolicy(upgradePolicy);

      // Check if user has already accepted this policy version
      const accepted = await subscriptionPolicyApi.checkPolicyAcceptance(
        accountId,
        'upgrade',
        upgradePolicy.version
      );
      setHasAcceptedPolicy(accepted);
    } catch (err) {
      console.error('Error loading policy:', err);
      setError('Failed to load upgrade policy');
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
        policyType: 'upgrade',
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent
      };

      await subscriptionPolicyApi.acceptPolicy(request);
      setHasAcceptedPolicy(true);
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
        policyType: 'upgrade',
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent
      };

      await subscriptionPolicyApi.acceptPolicy(request);
      setHasAcceptedPolicy(true);

      // Record the subscription change
      await subscriptionPolicyApi.recordSubscriptionChange({
        accountId,
        changeType: 'upgrade',
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={`upgrade-confirmation loading ${className}`}>
        <div className="loading-spinner"></div>
        <p>Loading upgrade confirmation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`upgrade-confirmation error ${className}`}>
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
    <div className={`upgrade-confirmation ${className}`}>
      <div className="confirmation-header">
        <h2>Confirm Plan Upgrade</h2>
        <p>You're about to upgrade from {currentPlan.name} to {newPlan.name}</p>
      </div>

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

        <div className="upgrade-arrow">→</div>

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
          nextBillingDate={(() => {
            // Validate daysRemaining to prevent invalid date creation
            const validDaysRemaining = isNaN(daysRemaining) || daysRemaining < 0 ? 30 : Math.min(daysRemaining, 365);
            const futureDate = new Date(Date.now() + validDaysRemaining * 24 * 60 * 60 * 1000);
            return futureDate.toISOString();
          })()}
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
            <h3>Upgrade Policy</h3>
            <div className="policy-text" dangerouslySetInnerHTML={{ __html: policy.content }} />
          </div>
          <button onClick={handleAcceptPolicy} className="accept-policy-button">
            I Accept the Upgrade Policy
          </button>
        </div>
      )}

      <div className="confirmation-note">
        <p>
          <strong>Note:</strong> Your upgrade will be processed immediately. 
          Any proration adjustments will be applied to your next billing cycle.
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
          Confirm Upgrade
        </button>
      </div>
    </div>
  );
};

export default UpgradeConfirmation; 