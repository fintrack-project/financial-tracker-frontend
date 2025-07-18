import React, { useState, useEffect } from 'react';
import { SubscriptionPolicy as SubscriptionPolicyType, SubscriptionPolicyProps, PolicyContent } from '../../types';
import { subscriptionPolicyApi } from '../../api';
import './SubscriptionPolicy.css';

interface ExtendedSubscriptionPolicyProps extends SubscriptionPolicyProps {
  accountId: string;
}

const SubscriptionPolicy: React.FC<ExtendedSubscriptionPolicyProps> = ({
  accountId,
  policyType = 'general',
  onAccept,
  onDecline,
  showAcceptance = true,
  className = ''
}) => {
  const [policy, setPolicy] = useState<SubscriptionPolicyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchPolicy();
  }, [policyType]);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentPolicy = await subscriptionPolicyApi.getCurrentPolicy(policyType);
      setPolicy(currentPolicy);
    } catch (err) {
      setError('Failed to load policy');
      console.error('Error fetching policy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!policy) return;

    try {
      setAccepting(true);
      
      // Record policy acceptance
      await subscriptionPolicyApi.acceptPolicy({
        accountId,
        policyVersion: policy.version,
        policyType: policy.policyType,
        ipAddress: '', // Could be captured from request
        userAgent: navigator.userAgent
      });

      onAccept?.(policy);
    } catch (err) {
      setError('Failed to accept policy');
      console.error('Error accepting policy:', err);
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    onDecline?.();
  };

  const parsePolicyContent = (content: string): PolicyContent => {
    try {
      return JSON.parse(content);
    } catch {
      return {
        title: 'Policy',
        content: content
      };
    }
  };

  if (loading) {
    return (
      <div className={`subscription-policy loading ${className}`}>
        <div className="policy-loading">
          <div className="loading-spinner"></div>
          <p>Loading policy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`subscription-policy error ${className}`}>
        <div className="policy-error">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
          <button onClick={fetchPolicy} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className={`subscription-policy not-found ${className}`}>
        <div className="policy-not-found">
          <i className="not-found-icon">📄</i>
          <p>No policy found for type: {policyType}</p>
        </div>
      </div>
    );
  }

  const policyContent = parsePolicyContent(policy.content);

  return (
    <div className={`subscription-policy ${className}`}>
      <div className="policy-header">
        <h2 className="policy-title">{policyContent.title}</h2>
        <div className="policy-meta">
          <span className="policy-version">Version {policy.version}</span>
          <span className="policy-effective-date">
            Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="policy-content">
        {policyContent.sections && (
          <div className="policy-sections">
            {policyContent.sections.map((section, index) => (
              <div key={index} className="policy-section">
                <h3 className="section-title">{section}</h3>
              </div>
            ))}
          </div>
        )}
        
        {policyContent.content && (
          <div className="policy-text">
            <p>{policyContent.content}</p>
          </div>
        )}
      </div>

      {showAcceptance && (
        <div className="policy-actions">
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="accept-button"
          >
            {accepting ? 'Accepting...' : 'I Accept'}
          </button>
          
          <button
            onClick={handleDecline}
            disabled={accepting}
            className="decline-button"
          >
            Decline
          </button>
        </div>
      )}

      <div className="policy-footer">
        <p className="policy-note">
          By accepting this policy, you agree to the terms and conditions outlined above.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPolicy; 