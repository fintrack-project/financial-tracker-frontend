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
    console.log('🔄 Initializing Stripe payment elements:', {
      stripeLoaded: !!stripe,
      elementsLoaded: !!elements
    });
    if (!stripe || !elements) {
      setError('Payment system is not available. Please try again later.');
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STEP 1: User initiates payment - Validate payment method
    console.log('🔵 STEP 1: User initiates payment', {
      selectedPlanName,
      selectedPaymentMethodId: selectedSubscriptionPaymentMethodId
    });

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

      // STEP 2: Backend creates PaymentIntent via Stripe
      console.log('🔵 STEP 2: Calling backend to create PaymentIntent', {
        accountId,
        selectedPlanName,
        paymentMethodId: selectedSubscriptionPaymentMethodId,
        returnUrl
      });

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
      console.log('✅ PaymentIntent created:', subscriptionData);

      // STEP 3: Frontend confirms payment via Stripe.js
      if (subscriptionData.paymentRequired && subscriptionData.clientSecret) {
        console.log('🔵 STEP 3: Confirming card payment with Stripe', {
          clientSecret: '***' + subscriptionData.clientSecret.slice(-10),
          paymentRequired: subscriptionData.paymentRequired
        });

        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(subscriptionData.clientSecret);
        if (confirmError) {
          console.error('❌ Payment confirmation failed:', confirmError);
          throw new Error(confirmError.message);
        }

        console.log('✅ Payment confirmed with Stripe:', {
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status
        });

        // STEP 4: Backend confirms the payment result
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('🔵 STEP 4: Confirming payment with backend', {
            paymentIntentId: paymentIntent.id,
            subscriptionId: subscriptionData.subscriptionId
          });

          const confirmResponse = await confirmSubscriptionPaymentApi(
            paymentIntent.id,
            subscriptionData.subscriptionId
          );

          if (!confirmResponse.success || !confirmResponse.data) {
            console.error('❌ Backend payment confirmation failed:', confirmResponse);
            throw new Error(confirmResponse.message || 'Failed to confirm subscription payment with backend');
          }

          console.log('✅ Payment confirmed with backend:', {
            status: confirmResponse.data.status,
            subscriptionId: confirmResponse.data.subscriptionId
          });

          // STEP 5: Frontend updates UI and completes the flow
          console.log('🔵 STEP 5: Completing subscription process');
          onSubscriptionComplete(confirmResponse.data.subscriptionId);
        } else {
          console.error('❌ Payment intent status not succeeded:', paymentIntent?.status);
          throw new Error('Payment was not completed successfully');
        }
      } else {
        // No payment required, subscription is active
        console.log('ℹ️ No payment required, completing subscription');
        onSubscriptionComplete(subscriptionData.subscriptionId);
      }
    } catch (err) {
      console.error('❌ Error processing subscription:', err);
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