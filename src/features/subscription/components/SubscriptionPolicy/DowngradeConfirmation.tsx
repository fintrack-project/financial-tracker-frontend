import React, { useState } from 'react';
import NextBillingInfo from './NextBillingInfo';
import ProrationPreview from './ProrationPreview';
import './DowngradeConfirmation.css';

interface DowngradeConfirmationProps {
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

const DowngradeConfirmation: React.FC<DowngradeConfirmationProps> = ({
  currentPlan,
  newPlan,
  daysRemaining,
  accountId,
  onConfirm,
  onCancel,
  className = ''
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showWarnings, setShowWarnings] = useState(true);

  // Policy loading removed for simplicity

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      console.error('Error confirming downgrade:', err);
      setError('Failed to confirm downgrade');
    }
  };

  if (error) {
    return (
      <div className={`downgrade-confirmation error ${className}`}>
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`downgrade-confirmation ${className}`}>
      <div className="confirmation-subtitle">
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

          {/* Policy section removed for simplicity */}

          <div className="confirmation-note">
            <p>
              <strong>Note:</strong> Your downgrade will take effect at the end of your current billing period. 
              You'll continue to have access to your current plan features until then.
            </p>
          </div>

          <div className="confirmation-actions">
            <button 
              onClick={handleConfirm} 
              className="confirm-button"
            >
              Confirm Downgrade
            </button>
            <button onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DowngradeConfirmation; 