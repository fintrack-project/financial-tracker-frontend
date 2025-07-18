import React, { useState, useEffect } from 'react';
import { PolicyAcceptanceProps } from '../../types';
import { subscriptionPolicyApi } from '../../api';
import './PolicyAcceptance.css';

const PolicyAcceptance: React.FC<PolicyAcceptanceProps> = ({
  accountId,
  policyType,
  policyVersion,
  onAccept,
  onDecline,
  className = ''
}) => {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAcceptanceStatus();
  }, [accountId, policyType, policyVersion]);

  const checkAcceptanceStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const accepted = await subscriptionPolicyApi.checkPolicyAcceptance(
        accountId,
        policyType,
        policyVersion
      );
      setHasAccepted(accepted);
    } catch (err) {
      console.error('Error checking policy acceptance:', err);
      setError('Failed to check policy acceptance status');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setAccepting(true);
      setError(null);
      
      await subscriptionPolicyApi.acceptPolicy({
        accountId,
        policyVersion,
        policyType,
        ipAddress: '', // Could be captured from request
        userAgent: navigator.userAgent
      });

      setHasAccepted(true);
      onAccept?.();
    } catch (err) {
      console.error('Error accepting policy:', err);
      setError('Failed to accept policy');
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    onDecline?.();
  };

  if (loading) {
    return (
      <div className={`policy-acceptance loading ${className}`}>
        <div className="acceptance-loading">
          <div className="loading-spinner"></div>
          <p>Checking policy status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`policy-acceptance error ${className}`}>
        <div className="acceptance-error">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
          <button onClick={checkAcceptanceStatus} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (hasAccepted) {
    return (
      <div className={`policy-acceptance accepted ${className}`}>
        <div className="acceptance-status">
          <i className="accepted-icon">✅</i>
          <p>Policy accepted</p>
          <span className="acceptance-date">
            Accepted on {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`policy-acceptance pending ${className}`}>
      <div className="acceptance-prompt">
        <h3 className="prompt-title">Policy Acceptance Required</h3>
        <p className="prompt-description">
          Please review and accept the {policyType} policy to continue.
        </p>
        
        <div className="acceptance-actions">
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="accept-policy-button"
          >
            {accepting ? 'Accepting...' : 'Accept Policy'}
          </button>
          
          <button
            onClick={handleDecline}
            disabled={accepting}
            className="decline-policy-button"
          >
            Decline
          </button>
        </div>
        
        <p className="acceptance-note">
          By accepting this policy, you agree to the terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default PolicyAcceptance; 