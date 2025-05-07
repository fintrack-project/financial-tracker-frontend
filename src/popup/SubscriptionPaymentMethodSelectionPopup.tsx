import React, { useState } from 'react';
import { PaymentMethod } from '../types/PaymentMethods';
import { createSubscription } from '../services/subscriptionService';
import './SubscriptionPaymentMethodPopupStyle.css';

interface SubscriptionPaymentMethodSelectionPopupProps {
  paymentMethods: PaymentMethod[];
  selectedPlanName: string;
  selectedPlanId: string;
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  onAddPaymentMethod: () => void;
  onCancel: () => void;
  onSubscriptionComplete: (subscriptionId: string) => void;
}

const PaymentMethodSelectionPopup: React.FC<SubscriptionPaymentMethodSelectionPopupProps> = ({
  paymentMethods,
  selectedPlanName,
  selectedPlanId,
  onSelectPaymentMethod,
  onAddPaymentMethod,
  onCancel,
  onSubscriptionComplete
}) => {
  const [selectedSubscriptionPaymentMethodId, setSelectedSubscriptionPaymentMethodId] = useState<string | null>(
    paymentMethods.find(method => method.default)?.stripePaymentMethodId || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscriptionPaymentMethodId) return;

    try {
      setIsProcessing(true);
      setError(null);

      const response = await createSubscription({
        planId: selectedPlanId,
        paymentMethodId: selectedSubscriptionPaymentMethodId
      });

      if (response.status === 'active') {
        onSubscriptionComplete(response.subscriptionId);
      } else if (response.status === 'pending') {
        // Handle pending status (e.g., show a message that subscription is being processed)
        setError('Your subscription is being processed. Please wait a moment...');
      } else {
        setError('Failed to create subscription. Please try again.');
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('An error occurred while processing your subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>Complete Your Subscription</h3>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <div className="popup-content">
          <p>
            You've selected the <strong>{selectedPlanName}</strong> plan. 
            Please select a payment method to complete your subscription.
          </p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {paymentMethods.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="subscription-payment-methods-list">
                {paymentMethods.map(method => (
                  <div 
                    key={method.stripePaymentMethodId} 
                    className={`payment-method-item ${
                      selectedSubscriptionPaymentMethodId === method.stripePaymentMethodId ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedSubscriptionPaymentMethodId(method.stripePaymentMethodId)}
                  >
                    <div className="payment-method-details">
                      <div className="card-brand">{method.cardBrand}</div>
                      <div className="card-last4">**** **** **** {method.cardLast4 || method.last4}</div>
                      <div className="card-expiry">Expires: {method.cardExpMonth}/{method.cardExpYear}</div>
                    </div>
                    <div className="payment-method-default">
                      {method.default && <span className="default-badge">Default</span>}
                    </div>
                    <input 
                      type="radio"
                      className="input-radio"
                      name="paymentMethod"
                      value={method.stripePaymentMethodId}
                      checked={selectedSubscriptionPaymentMethodId === method.stripePaymentMethodId}
                      onChange={() => setSelectedSubscriptionPaymentMethodId(method.stripePaymentMethodId)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="popup-actions">
                <button 
                  type="button" 
                  className="subscription-add-payment-method" 
                  onClick={onAddPaymentMethod}
                >
                  <span className="plus-icon"></span>
                  Add New Payment Method
                </button>
                <div className="action-buttons">
                  <button type="button" className="secondary-button" onClick={onCancel}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={!selectedSubscriptionPaymentMethodId || isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="no-payment-methods">
              <div className="alert-icon"></div>
              <p>You don't have any payment methods set up yet.</p>
              <button 
                className="subscription-add-payment-method primary" 
                onClick={onAddPaymentMethod}
              >
                <span className="plus-icon"></span>
                Add Payment Method
              </button>
              <button className="secondary-button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelectionPopup; 