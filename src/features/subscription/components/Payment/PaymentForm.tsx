import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
  onError?: (error: Error) => void;
  reset?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onCancel, onError, reset }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (reset) {
      setProcessing(false);
      const cardElement = elements?.getElement(CardElement);
      if (cardElement) {
        cardElement.clear();
      }
    }
  }, [reset, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      const errorMessage = 'Card element not found';
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
        const errorMessage = typeof stripeError === 'string' 
          ? stripeError 
          : stripeError.message || 'An error occurred while processing your card';
        
        onError?.(new Error(errorMessage));
        setProcessing(false);
        return;
      }

      if (!paymentMethod) {
        const errorMessage = 'Failed to create payment method';
        onError?.(new Error(errorMessage));
        setProcessing(false);
        return;
      }

      try {
        await onSuccess(paymentMethod.id);
      } catch (parentError: any) {
        let errorMessage = 'An error occurred while processing your payment';
        
        if (parentError?.response?.data?.message) {
          const apiMessage = parentError.response.data.message;
          if (apiMessage.includes('card_declined')) {
            errorMessage = 'Your card was declined.';
          } else {
            errorMessage = String(apiMessage);
          }
        } else if (parentError?.message) {
          errorMessage = String(parentError.message);
        }

        onError?.(new Error(errorMessage));
        setProcessing(false);
      }
    } catch (err: any) {
      const errorMessage = typeof err === 'string' 
        ? err 
        : err?.message || 'An unexpected error occurred';
      
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