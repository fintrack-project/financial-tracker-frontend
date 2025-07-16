import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../../../../shared/types/PaymentMethods';
import { upgradeSubscriptionApi, fetchUserSubscriptionApi } from '../../api/userSubscriptionApi';
import { finalizeSubscription } from '../../services/subscriptionPlanService';
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
      
      // Create return URL for 3D Secure authentication
      const returnUrl = `${window.location.origin}/subscription/confirm?accountId=${accountId}&planId=${selectedPlanId}`;
      
      const response = await upgradeSubscriptionApi(
        accountId,
        selectedPlanId,
        selectedPaymentMethodId,
        returnUrl // Pass return URL for 3D Secure support
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

      // Check if payment requires confirmation
      if (subscriptionData.paymentRequired && subscriptionData.clientSecret) {
        // For non-3D Secure cards, we need to confirm the payment
        // For 3D Secure cards, the payment is already confirmed but may require authentication
        setConfirmationData({
          subscriptionId: subscriptionData.subscriptionId,
          clientSecret: subscriptionData.clientSecret
        });
        setShowConfirmation(true);
        setPaymentStatus('Please confirm your payment details');
      } else {
        // Payment already completed (3D Secure card that was confirmed immediately)
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

      // Create return URL for 3D Secure authentication
      const returnUrl = `${window.location.origin}/subscription/confirm?accountId=${accountId}&planId=${selectedPlanId}`;

      // Finalize the subscription with 3D Secure support
      const finalizedSubscription = await finalizeSubscription(
        confirmationData.subscriptionId,
        confirmationData.clientSecret,
        stripe,
        selectedPaymentMethodId,
        returnUrl // Pass return URL for 3D Secure authentication
      );

      console.log('✅ Payment finalized successfully:', {
        subscriptionId: confirmationData.subscriptionId,
        status: finalizedSubscription.status,
        paymentRequired: finalizedSubscription.paymentRequired
      });

      // Check if payment requires additional authentication (3D Secure)
      if (finalizedSubscription.status === 'incomplete' && finalizedSubscription.paymentRequired) {
        console.log('🔐 Payment requires 3D Secure authentication');
        setPaymentStatus('Payment requires additional authentication. Please complete the verification process.');
        // The user will be redirected to 3D Secure authentication
        // The payment will be completed when they return via the return URL
        return;
      }

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
        <form onSubmit={handleSubmit}>
          <div className="payment-method-selection">
            <h3>Select Payment Method</h3>
            <p>Choose how you'd like to pay for your {selectedPlanName} subscription.</p>
            
            {paymentMethods.length === 0 ? (
              <div className="no-payment-methods">
                <div className="no-payment-methods-icon">💳</div>
                <h4>No Payment Methods Found</h4>
                <p>You need to add a payment method to complete your subscription.</p>
                <button 
                  type="button"
                  className="add-payment-method-button primary"
                  onClick={onAddPaymentMethod}
                >
                  + Add Payment Method
                </button>
              </div>
            ) : (
              <>
                <div className="payment-methods-list">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.stripePaymentMethodId}
                      className={`payment-method-option ${selectedPaymentMethodId === method.stripePaymentMethodId ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethodId(method.stripePaymentMethodId)}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.stripePaymentMethodId}
                        checked={selectedPaymentMethodId === method.stripePaymentMethodId}
                        onChange={() => setSelectedPaymentMethodId(method.stripePaymentMethodId)}
                        className="payment-method-radio"
                      />
                      <div className="payment-method-info">
                        <div className="payment-method-details">
                          <span className="card-brand">{method.cardBrand}</span>
                          <span className="card-last4">•••• {method.cardLast4}</span>
                          <span className="card-expiry">Expires {method.cardExpMonth}/{method.cardExpYear}</span>
                        </div>
                        {method.default && <span className="default-badge">Default</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="add-payment-method-section">
                  <button 
                    type="button"
                    className="add-payment-method-button"
                    onClick={onAddPaymentMethod}
                  >
                    + Add New Payment Method
                  </button>
                </div>
              </>
            )}
          </div>
          
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}
          
          {paymentStatus && (
            <div className="payment-status">
              <span>{paymentStatus}</span>
            </div>
          )}
          
          <div className="popup-actions">
            <button 
              type="submit"
              className="subscription-primary-button"
              disabled={
                isProcessing ||
                !selectedPaymentMethodId ||
                paymentMethods.length === 0 ||
                ((!stripe || !elements) && !paymentMethods.some(m => m.default))
              }
            >
              {isProcessing
                ? 'Processing...'
                : paymentMethods.length === 0
                  ? 'Add Payment Method First'
                  : 'Continue'}
            </button>
            <button 
              type="button"
              className="subscription-secondary-button"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </SubscriptionBasePopup>
  );
};

export default PaymentMethodSelectionPopup; 