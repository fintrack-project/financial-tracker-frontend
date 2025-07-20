import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types/SubscriptionPlan';
import NextBillingInfo from './NextBillingInfo';
import './CancellationConfirmation.css';

interface CancellationConfirmationProps {
  accountId: string;
  currentPlan: SubscriptionPlan;
  daysRemaining: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  className?: string;
}

const CancellationConfirmation: React.FC<CancellationConfirmationProps> = ({
  accountId,
  currentPlan,
  daysRemaining,
  onConfirm,
  onCancel,
  className = ''
}) => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Policy loading removed for simplicity

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      setError(null);
      await onConfirm();
    } catch (err) {
      console.error('Error confirming cancellation:', err);
      setError('Failed to process cancellation. Please try again.');
    } finally {
      setConfirming(false);
    }
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

      <div className="confirmation-note">
        <p>
          <strong>Important:</strong> Your subscription will remain active until the end of your current billing period. 
          You can reactivate anytime before then.
        </p>
      </div>

      <div className="confirmation-actions">
        <button
          onClick={handleConfirm}
          disabled={confirming}
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
    </div>
  );
};

export default CancellationConfirmation; 