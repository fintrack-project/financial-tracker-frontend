import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentMethod } from '../../types/PaymentMethod';
import { UserDetails } from '../../types/UserDetails';
import PaymentForm from '../Payment/PaymentForm';
import './PaymentMethods.css';

interface PaymentMethodsProps {
  userDetails: UserDetails;
  paymentMethods: PaymentMethod[];
  onSetDefault: (paymentMethodId: string) => void;
  onDelete: (paymentMethodId: string) => void;
  onAttach: (accountId: string, paymentMethodId: string) => void;
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

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
                    onClick={() => onSetDefault(method.id.toString())}
                    className="action-button"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => onDelete(method.id.toString())}
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
            onSuccess={(paymentMethodId) => {
              if (userDetails) {
                onAttach(userDetails.accountId, paymentMethodId);
              }
            }}
            onError={(error) => {
              console.error('Payment method error:', error);
              // You might want to show this error in a toast or alert
            }}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentMethods; 