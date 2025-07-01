import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../types/PaymentMethods';
import { upgradeSubscriptionApi, fetchUserSubscriptionApi } from '../features/subscription/api/userSubscriptionApi';
import { finalizeSubscription } from '../services/subscriptionPlanService';
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
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    subscriptionId: string;
    clientSecret: string;
  } | null>(null);

  useEffect(() => {
    console.log('🔄 Initializing Stripe payment elements:', {
      stripeLoaded: !!stripe,
      elementsLoaded: !!elements,
      hasDefaultPaymentMethod: !!paymentMethods.find(method => method.default)
    });
    
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

    const defaultMethod = paymentMethods.find(method => method.default);
    if ((!stripe || !elements) && !defaultMethod) {
      setError('Payment system is not available. Please try again later.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setPaymentStatus('Initializing payment process...');

      console.log('🔄 Starting subscription upgrade process:', {
        planId: selectedPlanId,
        paymentMethodId: selectedPaymentMethodId
      });

      setPaymentStatus('Creating subscription...');
      const response = await upgradeSubscriptionApi(
        accountId,
        selectedPlanId,
        selectedPaymentMethodId,
        null // TODO: Handle 3D Secure cards in the future
        // For 3D Secure cards, we'll need to:
        // 1. Check if card requires 3D Secure
        // 2. If yes, provide returnUrl for redirect
        // 3. Handle the redirect back from 3D Secure authentication
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update subscription');
      }

      const subscriptionData = response.data;
      console.log('✅ Subscription created:', {
        subscriptionId: subscriptionData.subscriptionId,
        paymentRequired: subscriptionData.paymentRequired,
        hasClientSecret: !!subscriptionData.clientSecret
      });

      if (subscriptionData.paymentRequired && subscriptionData.clientSecret) {
        setConfirmationData({
          subscriptionId: subscriptionData.subscriptionId,
          clientSecret: subscriptionData.clientSecret
        });
        setShowConfirmation(true);
        setPaymentStatus('Please confirm your payment details');
      } else {
        await completeSubscription(subscriptionData.subscriptionId);
      }
    } catch (err) {
      console.error('❌ Error processing subscription:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your subscription');
      setPaymentStatus('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const completeSubscription = async (subscriptionId: string) => {
    try {
      setPaymentStatus('Updating subscription details...');
      const freshSubscriptionData = await fetchUserSubscriptionApi(accountId);
      if (!freshSubscriptionData.success || !freshSubscriptionData.data) {
        throw new Error('Failed to fetch updated subscription data');
      }

      onSubscriptionComplete(freshSubscriptionData.data.id.toString());
      setPaymentStatus('Subscription completed successfully!');
      onCancel(); // Close the popup after successful completion
    } catch (error) {
      setError('Failed to complete subscription. Please try again.');
      setPaymentStatus('Failed to complete subscription');
    }
  };

  const handleConfirmPayment = async () => {
    if (!stripe || !confirmationData || !selectedPaymentMethodId) {
      setError('Payment system is not available');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setPaymentStatus('Processing payment...');

      // Finalize the subscription using the simplified flow
      const finalizedSubscription = await finalizeSubscription(
        confirmationData.subscriptionId,
        confirmationData.clientSecret,
        stripe,
        selectedPaymentMethodId
      );

      console.log('✅ Payment finalized successfully:', {
        subscriptionId: confirmationData.subscriptionId,
        status: finalizedSubscription.status
      });

      // Complete the subscription
      await completeSubscription(confirmationData.subscriptionId);
    } catch (error) {
      console.error('❌ Payment finalization failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment. Please try again or use a different payment method.');
      setPaymentStatus('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SubscriptionBasePopup
      title="Complete Your Subscription"
      onClose={onCancel}
    >
      {showConfirmation ? (
        <div className="payment-confirmation">
          <h3>Confirm Your Payment</h3>
          <p>Please review your payment details and confirm to complete your subscription.</p>
          <div className="confirmation-details">
            <p><strong>Plan:</strong> {selectedPlanName}</p>
            <p><strong>Payment Method:</strong> {paymentMethods.find(m => m.stripePaymentMethodId === selectedPaymentMethodId)?.cardBrand} ending in {paymentMethods.find(m => m.stripePaymentMethodId === selectedPaymentMethodId)?.cardLast4}</p>
          </div>
          <div className="confirmation-actions">
            <button 
              className="subscription-primary-button"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
            <button 
              className="subscription-secondary-button"
              onClick={() => {
                setShowConfirmation(false);
                setConfirmationData(null);
              }}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <>
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
                  <button 
                    type="submit" 
                    className="subscription-primary-button"
                    disabled={!selectedPaymentMethodId || isProcessing || !stripe}
                  >
                    {isProcessing ? paymentStatus : 'Pay Now'}
                  </button>
                  <button type="button" className="subscription-secondary-button" onClick={onCancel}>
                    Cancel
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
        </>
      )}
      {error && (
        <div className="subscription-error-message">
          {error}
        </div>
      )}
      {paymentStatus && !error && (
        <div className="subscription-status-message">
          {paymentStatus}
        </div>
      )}
    </SubscriptionBasePopup>
  );
};

export default PaymentMethodSelectionPopup; 