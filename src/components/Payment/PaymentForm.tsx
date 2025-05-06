import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { isStripeInitialized } from '../../config/stripe';
import { verifyPaymentMethodApi } from '../../api/paymentMethodApi';
import { StripePaymentMethod } from '../../types/PaymentMethods';
import { PaymentError } from '../../api/paymentMethodApi';
import './PaymentForm.css';

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: any) => void;
}

interface ErrorState {
  message: string;
  type: 'card_error' | 'validation_error' | 'payment_error' | 'internal_error';
  code?: string;
  field?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<ErrorState | null>(null);
  const [processing, setProcessing] = useState(false);
  const [stripeInitialized, setStripeInitialized] = useState(false);

  // Debug logging for component mount and state changes
  useEffect(() => {
    console.log('=== PaymentForm Component State ===');
    console.log('1. Component Mount:', {
      hasStripe: !!stripe,
      hasElements: !!elements,
      isInitialized: stripeInitialized,
      hasError: !!error,
      isProcessing: processing
    });
  }, [stripe, elements, stripeInitialized, error, processing]);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log('=== Stripe Initialization Process ===');
        console.log('1. Starting initialization:', {
          hasStripe: !!stripe,
          hasElements: !!elements,
          isInitialized: isStripeInitialized()
        });

        if (!isStripeInitialized()) {
          console.error('2. Stripe configuration missing');
          throw new Error('Stripe configuration is missing');
        }

        if (!stripe || !elements) {
          console.error('3. Stripe elements not ready:', {
            stripe: !!stripe,
            elements: !!elements
          });
          throw new Error('Stripe elements not ready');
        }

        // Validate Stripe key format
        const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
        if (!stripeKey || !stripeKey.startsWith('pk_test_') && !stripeKey.startsWith('pk_live_')) {
          console.error('4. Invalid Stripe key format:', {
            keyPresent: !!stripeKey,
            keyPrefix: stripeKey?.substring(0, 7),
            keyLength: stripeKey?.length
          });
          throw new Error('Invalid Stripe key format');
        }

        console.log('5. Stripe initialization successful');
        setStripeInitialized(true);
      } catch (err) {
        console.error('6. Stripe initialization error:', {
          error: err,
          type: err instanceof Error ? err.constructor.name : typeof err,
          message: err instanceof Error ? err.message : 'Unknown error'
        });
        const error = err instanceof Error ? err : new Error('Failed to initialize payment system');
        setError({
          message: error.message,
          type: 'internal_error'
        });
        onError(error);
      }
    };

    initializeStripe();
  }, [stripe, elements, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('=== Payment Form Submission ===');
    console.log('1. Form submitted:', {
      hasStripe: !!stripe,
      hasElements: !!elements,
      processing,
      stripeInitialized
    });

    if (!stripe || !elements || !stripeInitialized) {
      console.error('2. Stripe not initialized:', {
        hasStripe: !!stripe,
        hasElements: !!elements,
        stripeInitialized
      });
      setError({
        message: 'Payment system is not ready. Please try again.',
        type: 'internal_error'
      });
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      console.log('4. Card element status:', { found: !!cardElement });

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('5. Creating payment method...');
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        console.error('6. Stripe error:', stripeError);
        setError({
          message: stripeError.message || 'Card was declined. Please check your card details and try again.',
          type: stripeError.type as 'card_error' | 'validation_error',
          code: stripeError.code,
          field: stripeError.param
        });
        setProcessing(false);
        return;
      }

      if (!paymentMethod) {
        throw new Error('No payment method returned from Stripe');
      }

      console.log('8. Payment method created successfully:', paymentMethod);

      // Add a small delay to ensure the payment method is fully registered with Stripe
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        console.log('9. Verifying payment method...');
        const verifiedPaymentMethod = await verifyPaymentMethodApi(paymentMethod.id);
        console.log('9. Verified payment method:', verifiedPaymentMethod);

        // Only clear the card element and call onSuccess if everything is successful
        cardElement.clear();
        onSuccess(paymentMethod.id);
      } catch (verifyError) {
        console.error('10. Verification error:', verifyError);
        // Handle backend verification errors
        if (verifyError instanceof Error) {
          if (verifyError.name === 'PaymentError') {
            const paymentError = verifyError as PaymentError;
            setError({
              message: paymentError.message,
              type: paymentError.type as 'payment_error' | 'internal_error',
              code: paymentError.code || undefined
            });
            // Propagate the error to the parent component
            onError(paymentError);
          } else {
            setError({
              message: verifyError.message,
              type: 'internal_error'
            });
            onError(verifyError);
          }
        } else {
          setError({
            message: 'Failed to verify payment method. Please try again.',
            type: 'internal_error'
          });
          onError(new Error('Failed to verify payment method'));
        }
        setProcessing(false);
        return;
      }
    } catch (error) {
      console.error('11. Error in handleSubmit:', error);
      // Handle general errors
      if (error instanceof Error) {
        if (error.name === 'PaymentError') {
          const paymentError = error as PaymentError;
          setError({
            message: paymentError.message,
            type: paymentError.type as 'payment_error' | 'internal_error',
            code: paymentError.code || undefined
          });
          onError(paymentError);
        } else {
          setError({
            message: error.message,
            type: 'internal_error'
          });
          onError(error);
        }
      } else {
        setError({
          message: 'An unexpected error occurred. Please try again.',
          type: 'internal_error'
        });
        onError(new Error('An unexpected error occurred'));
      }
      setProcessing(false);
      return;
    } finally {
      setProcessing(false);
    }
  };

  if (!stripeInitialized) {
    console.log('10. Rendering initialization state:', {
      error: error || 'No error',
      stripeInitialized
    });
    return (
      <div className="payment-form">
        <div className="error-message">
          {error?.message || 'Initializing payment system...'}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="card-element">Credit or debit card</label>
          <div className={`card-element-container ${error?.field ? 'error' : ''}`}>
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {error?.field && (
            <div className="field-error">
              Please check this field
            </div>
          )}
        </div>
      </div>

      <div className="test-instructions">
        <h4>Test Card Information</h4>
        <p>For testing, use these card details:</p>
        <ul>
          <li><strong>Card Number:</strong> 4242 4242 4242 4242 (Visa - successful payment)</li>
          <li><strong>Card Number:</strong> 4000 0000 0000 0002 (Visa - card declined)</li>
          <li><strong>Card Number:</strong> 4000 0000 0000 3220 (Visa - 3D Secure authentication)</li>
          <li><strong>Expiry Date:</strong> Any future date (e.g., 12/25)</li>
          <li><strong>CVC:</strong> Any 3 digits (e.g., 123)</li>
          <li><strong>ZIP Code:</strong> 12345 (US format)</li>
        </ul>
        <p className="note">Note: The ZIP code is automatically set to 12345 for testing purposes.</p>
      </div>

      {error && (
        <div className={`error-message ${error.type}`}>
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error.message}</span>
          </div>
          <button 
            type="button" 
            className="retry-button"
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="submit-button"
      >
        {processing ? 'Processing...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

export default PaymentForm; 