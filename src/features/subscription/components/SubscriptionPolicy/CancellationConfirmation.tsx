import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import NextBillingInfo from './NextBillingInfo';
import './CancellationConfirmation.css';

interface CancellationConfirmationProps {
  accountId: string;
  currentPlan: SubscriptionPlan;
  daysRemaining: number;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
  onPause: () => void;
  className?: string;
}

const CancellationConfirmation: React.FC<CancellationConfirmationProps> = ({
  accountId,
  currentPlan,
  daysRemaining,
  onConfirm,
  onCancel,
  onPause,
  className = ''
}) => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [showAlternatives, setShowAlternatives] = useState(true);

  const cancellationReasons = [
    { value: 'too_expensive', label: 'Too expensive' },
    { value: 'not_using', label: 'Not using it enough' },
    { value: 'missing_features', label: 'Missing features I need' },
    { value: 'switching', label: 'Switching to another service' },
    { value: 'temporary', label: 'Temporary pause needed' },
    { value: 'other', label: 'Other reason' }
  ];

  const alternatives = [
    {
      title: 'Pause Subscription',
      description: 'Temporarily pause your subscription and resume anytime',
      action: 'Pause Instead',
      onClick: onPause
    },
    {
      title: 'Downgrade to Free',
      description: 'Keep basic features with our free plan',
      action: 'Downgrade',
      onClick: () => {/* Handle downgrade */}
    },
    {
      title: 'Contact Support',
      description: 'Let us help you find the right solution',
      action: 'Get Help',
      onClick: () => {/* Handle support contact */}
    }
  ];

  // Policy loading removed for simplicity

  const handleConfirm = async () => {
    if (!selectedReason) {
      setError('Please select a reason for cancellation');
      return;
    }

    try {
      setConfirming(true);
      setError(null);



      await onConfirm(selectedReason);
    } catch (err) {
      console.error('Error confirming cancellation:', err);
      setError('Failed to process cancellation. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (error && !confirming) {
    return (
      <div className={`cancellation-confirmation error ${className}`}>
        <div className="confirmation-error">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`cancellation-confirmation ${className}`}>
      <div className="confirmation-subtitle">
        We're sorry to see you go. Your {currentPlan.name} plan will be cancelled.
      </div>

      {showAlternatives && (
        <div className="alternatives-section">
          <h3 className="alternatives-title">Before you go, consider these options:</h3>
          <div className="alternatives-grid">
            {alternatives.map((alternative, index) => (
              <div key={index} className="alternative-card">
                <h4 className="alternative-title">{alternative.title}</h4>
                <p className="alternative-description">{alternative.description}</p>
                <button
                  onClick={alternative.onClick}
                  className="alternative-button"
                >
                  {alternative.action}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAlternatives(false)}
            className="proceed-cancellation-button"
          >
            Proceed with Cancellation
          </button>
        </div>
      )}

      {!showAlternatives && (
        <>
          <div className="current-plan-info">
            <h3 className="plan-title">Current Plan: {currentPlan.name}</h3>
            <div className="plan-details">
              <div className="plan-price">{formatCurrency(currentPlan.amount)}/month</div>
              <div className="plan-features">
                <h4>You'll lose access to:</h4>
                <ul>
                  {currentPlan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="billing-info-section">
            <NextBillingInfo
              currentPlan={currentPlan.name}
              newPlan="No Plan"
              nextBillingDate={(() => {
                // Validate daysRemaining to prevent invalid date creation
                const validDaysRemaining = isNaN(daysRemaining) || daysRemaining < 0 ? 30 : Math.min(daysRemaining, 365);
                const futureDate = new Date(Date.now() + validDaysRemaining * 24 * 60 * 60 * 1000);
                return futureDate.toISOString();
              })()}
              nextBillingAmount={0}
            />
          </div>

          <div className="reason-section">
            <h3 className="reason-title">Why are you cancelling?</h3>
            <div className="reason-options">
              {cancellationReasons.map((reason) => (
                <label key={reason.value} className="reason-option">
                  <input
                    type="radio"
                    name="cancellation-reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                  <span className="reason-label">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              onClick={handleConfirm}
              disabled={!selectedReason || confirming}
              className="confirm-button"
            >
              {confirming ? 'Processing Cancellation...' : 'Confirm Cancellation'}
            </button>
            
            <button
              onClick={onCancel}
              disabled={confirming}
              className="cancel-button"
            >
              Keep Subscription
            </button>
          </div>

          {error && (
            <div className="confirmation-error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="confirmation-note">
            <p>
              <strong>Important:</strong> Your subscription will remain active until the end of your current billing period. 
              You can reactivate anytime before then.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CancellationConfirmation; 