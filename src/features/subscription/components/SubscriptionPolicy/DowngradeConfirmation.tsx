import React, { useState } from 'react';
import NextBillingInfo from './NextBillingInfo';
import ProrationPreview from './ProrationPreview';
import './DowngradeConfirmation.css';

interface DowngradeConfirmationProps {
  currentPlan: {
    id: string;
    name: string;
    amount: number;
    interval?: 'month' | 'year';
  };
  newPlan: {
    id: string;
    name: string;
    amount: number;
    interval?: 'month' | 'year';
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
        <p>You're about to downgrade from {currentPlan.name} {currentPlan.interval === 'year' ? 'Annual' : 'Monthly'} to {newPlan.name} {newPlan.interval === 'year' ? 'Annual' : 'Monthly'}</p>
      </div>

      {showWarnings && (
        <div className="warnings-section">
          <div className="warning-card compact">
            <div className="warning-header">
              <span className="warning-icon">⚠️</span>
              <span className="warning-text">Important Changes</span>
            </div>
            <div className="warning-items">
              <span>• You'll lose access to premium features</span>
              <span>• Your data limits will be reduced</span>
              <span>• Changes take effect at the end of your current billing period</span>
            </div>
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
              currentPlanInterval={currentPlan.interval}
              newPlanInterval={newPlan.interval}
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