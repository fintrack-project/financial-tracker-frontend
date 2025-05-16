import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentMethod, PaymentError } from '../../types/PaymentMethods';
import { UserDetails } from '../../types/UserDetails';
import PaymentForm from '../Payment/PaymentForm';
import TestCardDetails from '../Payment/TestCardDetails';
import { stripePromise } from '../../config/stripe';
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

  // Log payment methods for debugging
  useEffect(() => {
    console.log('Payment Methods:', paymentMethods);
  }, [paymentMethods]);

  // Validate user details exist
  if (!userDetails) return null;

  const handlePaymentError = (error: Error) => {
    // Format error for display
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
      // Clear any existing errors
      setError(null);
      
      // Attempt to attach payment method
      await onAttach(accountId, paymentMethodId);
    } catch (error) {
      // Handle attachment errors
      handlePaymentError(error as Error);
    }
  };

  return (
    <div className="payment-methods">
      <h3>Payment Methods</h3>
      <div className="payment-methods-content">
        {/* Render existing payment methods if any */}
        {paymentMethods && paymentMethods.length > 0 ? (
          <div className="payment-methods-list">
            {paymentMethods
              .slice() // copy array to avoid mutating props
              .sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0))
              .map((method) => {
                // Log each method's default status
                console.log(`Method ${method.id} default:`, method.default);
                return (
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
                      {method.default && (
                        <span className="default-badge" style={{ 
                          backgroundColor: '#4CAF50', 
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          marginLeft: '8px'
                        }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div className="payment-method-actions">
                      {/* Show set default button if not already default */}
                      {!method.default && (
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
                );
              })}
          </div>
        ) : (
          // Show empty state if no payment methods
          <div className="no-payment-methods">
            <p>No payment methods added yet.</p>
            <p className="add-payment-method-hint">Add a payment method to manage your subscription.</p>
          </div>
        )}

        {/* Render payment form for adding new methods */}
        <div className="add-payment-method">
          <h4>Add New Payment Method</h4>
          
          <TestCardDetails />

          <Elements stripe={stripePromise}>
            <PaymentForm
              onSuccess={(stripePaymentMethodId) => {
                // Handle successful payment method creation
                if (userDetails) {
                  handleAttach(userDetails.accountId, stripePaymentMethodId);
                }
              }}
              onError={handlePaymentError}
              onCancel={() => {}}
              reset={!error}
            />
          </Elements>
          
          {error && (
            <div className={`error-message ${error.type}`} role="alert">
              <div className="error-content">
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