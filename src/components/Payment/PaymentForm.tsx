import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred');
        onError(error.message || 'An error occurred');
      } else if (paymentMethod) {
        onSuccess(paymentMethod.id);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred');
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="test-card-info">
        <h3>Test Card Information</h3>
        <p>Use these test card numbers for testing:</p>
        <ul>
          <li>4242 4242 4242 4242 - Visa (successful payment)</li>
          <li>4000 0000 0000 0002 - Card declined</li>
          <li>4000 0000 0000 3220 - 3D Secure authentication</li>
        </ul>
        <p>Use any future expiry date and any 3-digit CVC</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-element-container">
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

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="submit-button"
        >
          {isProcessing ? 'Processing...' : 'Add Payment Method'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 