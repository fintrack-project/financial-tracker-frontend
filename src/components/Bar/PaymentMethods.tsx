import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentMethod } from '../../types/PaymentMethods';
import { UserDetails } from '../../types/UserDetails';
import PaymentForm from '../Payment/PaymentForm';
import { stripePromise } from '../../config/stripe';
import './PaymentMethods.css';

interface PaymentMethodsProps {
  userDetails: UserDetails;
  paymentMethods: PaymentMethod[];
  onSetDefault: (paymentMethodId: string) => void;
  onDelete: (paymentMethodId: string) => void;
  onAttach: (accountId: string, paymentMethodId: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  userDetails,
  paymentMethods,
  onSetDefault,
  onDelete,
  onAttach
}) => {
  if (!userDetails) return null;

  return (
    <div className="payment-methods">
      <h3>Payment Methods</h3>
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
                onAttach(userDetails.accountId, stripePaymentMethodId);
              }
            }}
            onError={(error) => {
              console.error('Payment method error:', error);
            }}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentMethods; 