import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../types/PaymentMethods';
import { upgradeSubscriptionApi, fetchUserSubscriptionApi } from '../api/userSubscriptionApi';
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
      setPaymentStatus('Initializing payment process...');

      console.log('🔄 Starting subscription upgrade process:', {
        planId: selectedPlanId,
        paymentMethodId: selectedPaymentMethodId
      });

      setPaymentStatus('Creating subscription...');
      const response = await upgradeSubscriptionApi(
        accountId,
        selectedPlanId,
        selectedPaymentMethodId
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
        if (!stripe) {
          throw new Error('Payment system is not available');
        }

        try {
          setPaymentStatus('Processing payment...');
          console.log('🔄 Starting payment finalization:', {
            subscriptionId: subscriptionData.subscriptionId,
            hasClientSecret: !!subscriptionData.clientSecret
          });

          // Use the finalizeSubscription service
          const finalizedSubscription = await finalizeSubscription(
            subscriptionData.subscriptionId,
            subscriptionData.clientSecret,
            stripe
          );

          console.log('✅ Payment finalized successfully:', {
            subscriptionId: subscriptionData.subscriptionId,
            status: finalizedSubscription.status
          });

          setPaymentStatus('Updating subscription details...');
          // Fetch fresh subscription data after successful payment
          const freshSubscriptionData = await fetchUserSubscriptionApi(accountId);
          if (!freshSubscriptionData.success || !freshSubscriptionData.data) {
            throw new Error('Failed to fetch updated subscription data');
          }

          console.log('✅ Subscription updated:', {
            subscriptionId: freshSubscriptionData.data.id,
            status: freshSubscriptionData.data.status
          });

          // Call onSubscriptionComplete with the fresh data
          onSubscriptionComplete(freshSubscriptionData.data.id.toString());
          setPaymentStatus('Subscription completed successfully!');
        } catch (finalizeError) {
          console.error('❌ Payment finalization failed:', {
            error: finalizeError,
            subscriptionId: subscriptionData.subscriptionId
          });
          
          // Handle specific error cases
          let errorMessage = 'Failed to process payment';
          if (finalizeError instanceof Error) {
            if (finalizeError.message.includes('Stripe payment failed')) {
              errorMessage = 'Payment processing failed. Please try again or use a different payment method.';
            } else if (finalizeError.message.includes('Payment confirmation failed')) {
              errorMessage = 'Payment could not be confirmed. Please try again or use a different payment method.';
            } else if (finalizeError.message.includes('Payment not completed')) {
              errorMessage = 'Payment was not completed successfully. Please try again.';
            } else {
              errorMessage = finalizeError.message;
            }
          }
          
          setError(errorMessage);
          setPaymentStatus('Payment failed');
          throw new Error(errorMessage);
        }
      } else {
        setPaymentStatus('Updating subscription details...');
        // Fetch fresh subscription data even if no payment was required
        const freshSubscriptionData = await fetchUserSubscriptionApi(accountId);
        if (!freshSubscriptionData.success || !freshSubscriptionData.data) {
          throw new Error('Failed to fetch updated subscription data');
        }

        console.log('✅ Subscription updated (no payment required):', {
          subscriptionId: freshSubscriptionData.data.id,
          status: freshSubscriptionData.data.status
        });

        // Call onSubscriptionComplete with the fresh data
        onSubscriptionComplete(freshSubscriptionData.data.id.toString());
        setPaymentStatus('Subscription completed successfully!');
      }
    } catch (err) {
      console.error('❌ Error processing subscription:', {
        error: err,
        planId: selectedPlanId,
        paymentMethodId: selectedPaymentMethodId
      });
      setError(err instanceof Error ? err.message : 'An error occurred while processing your subscription. Please try again.');
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
                {isProcessing ? paymentStatus : 'Pay Now'}
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
      {paymentStatus && !error && (
        <div className="subscription-status-message">
          {paymentStatus}
        </div>
      )}
    </SubscriptionBasePopup>
  );
};

export default PaymentMethodSelectionPopup; 