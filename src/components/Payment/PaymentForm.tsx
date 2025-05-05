import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { isStripeInitialized } from '../../config/stripe';
import { verifyPaymentMethodApi } from '../../api/paymentMethodApi';
import { StripePaymentMethod } from '../../types/PaymentMethods';
import './PaymentForm.css';

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
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
        setError(error.message);
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
      isProcessing: processing,
      stripeInitialized
    });

    if (!stripeInitialized) {
      console.error('2. Stripe not initialized:', {
        stripeInitialized,
        hasStripe: !!stripe,
        hasElements: !!elements
      });
      const error = new Error('Payment system is not initialized');
      setError(error.message);
      onError(error);
      return;
    }

    if (!stripe || !elements) {
      console.error('3. Payment system not ready:', {
        stripe: !!stripe,
        elements: !!elements
      });
      const error = new Error('Payment system is not ready');
      setError(error.message);
      onError(error);
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      console.log('4. Card element status:', {
        found: !!cardElement
      });

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('5. Creating payment method...');
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          address: {
            postal_code: '12345'
          }
        }
      });

      if (stripeError) {
        console.error('6. Stripe error details:', {
          type: stripeError.type,
          message: stripeError.message,
          code: stripeError.code,
          decline_code: stripeError.decline_code
        });
        throw stripeError;
      }

      if (!paymentMethod) {
        console.error('7. No payment method returned');
        throw new Error('No payment method returned');
      }

      console.log('8. Payment method created successfully:', {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        } : null
      });

      // Wait a moment to ensure the payment method is fully registered with Stripe
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the payment method exists
      try {
        const verifiedMethod = await verifyPaymentMethodApi(paymentMethod.id);
        console.log('9. Verified payment method:', {
          id: verifiedMethod.id,
          type: verifiedMethod.type,
          card: verifiedMethod.card ? {
            brand: verifiedMethod.card.brand,
            last4: verifiedMethod.card.last4,
            exp_month: verifiedMethod.card.exp_month,
            exp_year: verifiedMethod.card.exp_year
          } : null
        });
      } catch (verifyError) {
        console.error('10. Payment method verification failed:', verifyError);
        throw new Error('Payment method verification failed');
      }

      onSuccess(paymentMethod.id);
    } catch (err) {
      console.error('11. Payment error details:', {
        error: err,
        type: err instanceof Error ? err.constructor.name : typeof err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      const error = err instanceof Error ? err : new Error('An unexpected error occurred');
      setError(error.message);
      onError(error);
    } finally {
      setProcessing(false);
      console.log('12. Payment process completed:', {
        success: !error,
        error: error || 'No error'
      });
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
          {error || 'Initializing payment system...'}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="card-element">Credit or debit card</label>
          <div className="card-element-container">
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

      {error && <div className="error-message">{error}</div>}
      
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