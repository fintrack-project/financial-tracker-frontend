import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../../types/PaymentMethods';
import { UserDetails } from '../../types/UserDetails';
import PaymentForm from '../Payment/PaymentForm';
import { stripePromise } from '../../config/stripe';
import { PaymentError } from '../../api/paymentMethodApi';
import './PaymentMethods.css';

interface PaymentMethodsProps {
  userDetails: UserDetails;
  paymentMethods: PaymentMethod[];
  onSetDefault: (paymentMethodId: string) => void;
  onDelete: (paymentMethodId: string) => void;
  onAttach: (accountId: string, paymentMethodId: string) => void;
}

interface ErrorState {
  message: string;
  type: 'payment_error' | 'internal_error';
  code?: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  userDetails,
  paymentMethods,
  onSetDefault,
  onDelete,
  onAttach
}) => {
  const [error, setError] = useState<ErrorState | null>(null);

  if (!userDetails) return null;

  const handlePaymentError = (error: Error) => {
    if (error instanceof PaymentError) {
      setError({
        message: error.message,
        type: error.type as 'payment_error' | 'internal_error',
        code: error.code || undefined
      });
    } else {
      setError({
        message: 'An unexpected error occurred. Please try again.',
        type: 'internal_error'
      });
    }
  };

  const handleAttach = async (accountId: string, paymentMethodId: string) => {
    try {
      setError(null);
      await onAttach(accountId, paymentMethodId);
    } catch (error) {
      handlePaymentError(error as Error);
    }
  };

  return (
    <div className="payment-methods">
      <h3>Payment Methods</h3>
      <div className="payment-methods-content">
        {paymentMethods && paymentMethods.length > 0 ? (
          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-method-item">
                <div className="payment-method-info">
                  <span className="card-brand">{method.cardBrand || 'Unknown'}</span>
                  <span className="card-last4">
                    {method.cardLast4 ? `**** **** **** ${method.cardLast4}` : 'No card details'}
                  </span>
                  <span className="card-expiry">
                    {method.cardExpMonth && method.cardExpYear 
                      ? `Expires ${method.cardExpMonth}/${method.cardExpYear}`
                      : 'No expiry date'}
                  </span>
                  {method.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="payment-method-actions">
                  {!method.isDefault && (
                    <button
                      onClick={() => onSetDefault(method.stripePaymentMethodId)}
                      className="action-button"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(method.stripePaymentMethodId)}
                    className="action-button delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-payment-methods">
            <p>No payment methods added yet.</p>
            <p className="add-payment-method-hint">Add a payment method to manage your subscription.</p>
          </div>
        )}

        <div className="add-payment-method">
          <h4>Add New Payment Method</h4>
          <Elements stripe={stripePromise}>
            <PaymentForm
              onSuccess={(stripePaymentMethodId) => {
                if (userDetails) {
                  handleAttach(userDetails.accountId, stripePaymentMethodId);
                }
              }}
              onError={handlePaymentError}
            />
          </Elements>
          {error && (
            <div className={`error-message ${error.type}`} role="alert">
              <div className="error-content">
                <span className="error-icon" aria-hidden="true">⚠️</span>
                <span className="error-text">
                  {error.message}
                  {error.code && <span className="error-code"> (Error code: {error.code})</span>}
                </span>
              </div>
              <button 
                type="button" 
                className="retry-button"
                onClick={() => setError(null)}
                aria-label="Try again"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods; 