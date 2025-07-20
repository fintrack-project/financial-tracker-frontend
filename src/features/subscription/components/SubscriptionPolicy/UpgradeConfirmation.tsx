import React, { useState } from 'react';
import NextBillingInfo from './NextBillingInfo';
import ProrationPreview from './ProrationPreview';
import './UpgradeConfirmation.css';

interface UpgradeConfirmationProps {
  currentPlan: {
    id: string;
    name: string;
    amount: number;
  };
  newPlan: {
    id: string;
    name: string;
    amount: number;
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
  const [error, setError] = useState<string | null>(null);

  // Policy loading removed for simplicity

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      console.error('Error confirming upgrade:', err);
      setError('Failed to confirm upgrade');
    }
  };

  if (error) {
    return (
      <div className={`upgrade-confirmation error ${className}`}>
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`upgrade-confirmation ${className}`}>
      <div className="confirmation-subtitle">
        <p>You're about to upgrade from {currentPlan.name} to {newPlan.name}</p>
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

      {/* Policy section removed for simplicity */}

      <div className="confirmation-note">
        <p>
          <strong>Note:</strong> Your upgrade will be processed immediately. 
          Any proration adjustments will be applied to your next billing cycle.
        </p>
      </div>

                <div className="confirmation-actions">
            <button 
              onClick={handleConfirm} 
              className="confirm-button"
            >
              Confirm Upgrade
            </button>
            <button onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          </div>
    </div>
  );
};

export default UpgradeConfirmation; 