import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
  onError?: (error: Error) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onCancel, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      const errorMessage = 'Card element not found';
      setError(errorMessage);
      onError?.(new Error(errorMessage));
      setProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        const errorMessage = stripeError.message || 'An error occurred while processing your card';
        setError(errorMessage);
        onError?.(new Error(errorMessage));
        setProcessing(false);
        return;
      }

      if (!paymentMethod) {
        const errorMessage = 'Failed to create payment method';
        setError(errorMessage);
        onError?.(new Error(errorMessage));
        setProcessing(false);
        return;
      }

      onSuccess(paymentMethod.id);
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-form-row">
        <CardElement
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
      {error && <div className="payment-form-error-message">{error}</div>}
      <div className="payment-form-actions-container">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="payment-form-submit-btn"
        >
          {processing ? 'Processing...' : 'Add Payment Method'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="payment-form-cancel-btn"
          disabled={processing}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PaymentForm; 