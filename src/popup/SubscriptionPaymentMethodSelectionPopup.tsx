import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../types/PaymentMethods';
import { updateSubscriptionApi, confirmSubscriptionPaymentApi } from '../api/userSubscriptionApi';
import './SubscriptionPaymentMethodPopupStyle.css';

interface SubscriptionPaymentMethodSelectionPopupProps {
  paymentMethods: PaymentMethod[];
  selectedPlanName: string;
  accountId: string;
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  onAddPaymentMethod: () => void;
  onCancel: () => void;
  onSubscriptionComplete: (subscriptionId: string) => void;
}

const PaymentMethodSelectionPopup: React.FC<SubscriptionPaymentMethodSelectionPopupProps> = ({
  paymentMethods,
  selectedPlanName,
  accountId,
  onSelectPaymentMethod,
  onAddPaymentMethod,
  onCancel,
  onSubscriptionComplete
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedSubscriptionPaymentMethodId, setSelectedSubscriptionPaymentMethodId] = useState<string | null>(
    paymentMethods.find(method => method.default)?.stripePaymentMethodId || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      setError('Payment system is not available. Please try again later.');
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscriptionPaymentMethodId) {
      setError('Please select a payment method');
      return;
    }

    if (!stripe || !elements) {
      setError('Payment system is not available. Please try again later.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Get the return URL based on the current window location
      const returnUrl = `${window.location.origin}/subscription/complete`;

      // 1. Update subscription and get payment intent if required
      const response = await updateSubscriptionApi(
        accountId,
        selectedPlanName,
        selectedSubscriptionPaymentMethodId,
        returnUrl
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update subscription');
      }

      const subscriptionData = response.data;

      // 2. Handle payment if required
      if (subscriptionData.paymentRequired && subscriptionData.clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(subscriptionData.clientSecret);
        if (confirmError) {
          throw new Error(confirmError.message);
        }

        // 3. Confirm the subscription payment
        if (subscriptionData.paymentIntentId) {
          const confirmResponse = await confirmSubscriptionPaymentApi(
            subscriptionData.paymentIntentId,
            subscriptionData.subscriptionId
          );

          if (!confirmResponse.success || !confirmResponse.data) {
            throw new Error(confirmResponse.message || 'Failed to confirm subscription payment');
          }

          onSubscriptionComplete(confirmResponse.data.subscriptionId);
        }
      } else {
        // No payment required, subscription is active
        onSubscriptionComplete(subscriptionData.subscriptionId);
      }
    } catch (err) {
      console.error('Error processing subscription:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your subscription. Please try again.');
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
                    disabled={!selectedSubscriptionPaymentMethodId || isProcessing || !stripe}
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
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelectionPopup; 