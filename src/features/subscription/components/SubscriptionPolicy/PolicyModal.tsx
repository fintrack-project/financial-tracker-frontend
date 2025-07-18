import React, { useEffect } from 'react';
import { PolicyModalProps } from '../../types';
import SubscriptionPolicy from './SubscriptionPolicy';
import './PolicyModal.css';

const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  policy,
  onAccept,
  onDecline
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleAccept = (acceptedPolicy: any) => {
    onAccept?.(acceptedPolicy);
    onClose();
  };

  const handleDecline = () => {
    onDecline?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="policy-modal-overlay" onClick={handleBackdropClick}>
      <div className="policy-modal">
        <div className="policy-modal-header">
          <h2 className="policy-modal-title">Subscription Policy</h2>
          <button
            className="policy-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="policy-modal-content">
          <SubscriptionPolicy
            accountId="" // This will be passed from parent component
            policyType={policy.policyType}
            onAccept={handleAccept}
            onDecline={handleDecline}
            showAcceptance={true}
            className="policy-modal-policy"
          />
        </div>
      </div>
    </div>
  );
};

export default PolicyModal; 