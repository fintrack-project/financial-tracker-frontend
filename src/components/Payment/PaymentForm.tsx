import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentError } from '../../api/paymentMethodApi';
import './PaymentForm.css';

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: Error) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new PaymentError(
          'payment_error',
          stripeError.message || 'Failed to process card details',
          stripeError.code || null
        );
      }

      if (!paymentMethod) {
        throw new Error('No payment method returned from Stripe');
      }

      onSuccess(paymentMethod.id);
    } catch (error) {
      const paymentError = error instanceof PaymentError 
        ? error 
        : new PaymentError('payment_error', 'Failed to process payment method', null);
      
      setError(paymentError.message);
      onError(paymentError);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Open Sans", sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="card-element">Credit or debit card</label>
          <div className="card-element-container">
            <CardElement
              id="card-element"
              options={cardElementOptions}
              className="card-element"
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

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="submit-button"
      >
        {isProcessing ? 'Processing...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

export default PaymentForm; 