import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../types/PaymentMethods';
import { updateSubscriptionApi, confirmSubscriptionPaymentApi } from '../api/userSubscriptionApi';
import SubscriptionBasePopup from './SubscriptionBasePopup';
import './SubscriptionBasePopup.css';
import './PaymentMethodSelection.css';

interface SubscriptionPaymentMethodSelectionPopupProps {
  paymentMethods: PaymentMethod[];
  selectedPlanName: string;
  selectedPlanId: string;
  accountId: string;
  onSelectPaymentMethod: (paymentMethodId: string) => Promise<void>;
  onAddPaymentMethod: () => void;
  onCancel: () => void;
  onSubscriptionComplete: (subscriptionId: string) => void;
}

const PaymentMethodSelectionPopup: React.FC<SubscriptionPaymentMethodSelectionPopupProps> = ({
  paymentMethods,
  selectedPlanName,
  selectedPlanId,
  accountId,
  onSelectPaymentMethod,
  onAddPaymentMethod,
  onCancel,
  onSubscriptionComplete
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(
    paymentMethods.find(method => method.default)?.stripePaymentMethodId || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 Initializing Stripe payment elements:', {
      stripeLoaded: !!stripe,
      elementsLoaded: !!elements,
      hasDefaultPaymentMethod: !!paymentMethods.find(method => method.default)
    });
    
    // Only show error if there's no default payment method and Stripe isn't loaded
    if (!stripe || !elements) {
      if (!paymentMethods.find(method => method.default)) {
        setError('Payment system is not available. Please try again later.');
      }
    }
  }, [stripe, elements, paymentMethods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPaymentMethodId) {
      setError('Please select a payment method');
      return;
    }

    // Only check for Stripe if we need to process a new payment
    const defaultMethod = paymentMethods.find(method => method.default);
    if ((!stripe || !elements) && !defaultMethod) {
      setError('Payment system is not available. Please try again later.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const returnUrl = `${window.location.origin}/subscription/complete`;
      
      console.log('Sending plan ID to API:', selectedPlanId);

      const response = await updateSubscriptionApi(
        accountId,
        selectedPlanId,  // Send the full plan ID directly
        selectedPaymentMethodId,
        returnUrl
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update subscription');
      }

      const subscriptionData = response.data;

      if (subscriptionData.paymentRequired && subscriptionData.clientSecret) {
        if (!stripe) {
          throw new Error('Payment system is not available');
        }
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(subscriptionData.clientSecret);
        if (confirmError) {
          throw new Error(confirmError.message);
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          const confirmResponse = await confirmSubscriptionPaymentApi(
            paymentIntent.id,
            subscriptionData.subscriptionId
          );

          if (!confirmResponse.success || !confirmResponse.data) {
            throw new Error(confirmResponse.message || 'Failed to confirm subscription payment with backend');
          }

          onSubscriptionComplete(confirmResponse.data.subscriptionId);
        } else {
          throw new Error('Payment was not completed successfully');
        }
      } else {
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
    <SubscriptionBasePopup
      title="Complete Your Subscription"
      onClose={onCancel}
    >
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
                className={`subscription-payment-method-item ${
                  selectedPaymentMethodId === method.stripePaymentMethodId ? 'selected' : ''
                }`}
                onClick={() => setSelectedPaymentMethodId(method.stripePaymentMethodId)}
              >
                <div className="subscription-payment-method-details">
                  <div className="subscription-card-brand">{method.cardBrand}</div>
                  <div className="subscription-card-last4">**** **** **** {method.cardLast4 || method.last4}</div>
                  <div className="subscription-card-expiry">Expires: {method.cardExpMonth}/{method.cardExpYear}</div>
                </div>
                <div className="subscription-payment-method-default">
                  {method.default && <span className="subscription-default-badge">Default</span>}
                </div>
                <input 
                  type="radio"
                  className="subscription-input-radio"
                  name="paymentMethod"
                  value={method.stripePaymentMethodId}
                  checked={selectedPaymentMethodId === method.stripePaymentMethodId}
                  onChange={() => setSelectedPaymentMethodId(method.stripePaymentMethodId)}
                />
              </div>
            ))}
          </div>
          
          <div className="subscription-popup-actions">
            <button 
              type="button" 
              className="subscription-add-payment-method" 
              onClick={onAddPaymentMethod}
            >
              <span className="subscription-plus-icon"></span>
              Add New Payment Method
            </button>
            <div className="subscription-action-buttons">
              <button type="button" className="subscription-secondary-button" onClick={onCancel}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="subscription-primary-button"
                disabled={!selectedPaymentMethodId || isProcessing || !stripe}
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="subscription-no-payment-methods">
          <div className="subscription-alert-icon"></div>
          <p>You don't have any payment methods set up yet.</p>
          <button 
            className="subscription-add-payment-method primary" 
            onClick={onAddPaymentMethod}
          >
            <span className="subscription-plus-icon"></span>
            Add Payment Method
          </button>
          <button className="subscription-secondary-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
      {error && (
        <div className="subscription-error-message">
          {error}
        </div>
      )}
    </SubscriptionBasePopup>
  );
};

export default PaymentMethodSelectionPopup; 