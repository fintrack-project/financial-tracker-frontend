import React, { useState } from 'react';
import { PaymentMethod } from '../types/PaymentMethods';
import './SubscriptionPaymentMethodPopupStyle.css';

interface SubscriptionPaymentMethodSelectionPopupProps {
  paymentMethods: PaymentMethod[];
  selectedPlanName: string;
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  onAddPaymentMethod: () => void;
  onCancel: () => void;
}

const PaymentMethodSelectionPopup: React.FC<SubscriptionPaymentMethodSelectionPopupProps> = ({
  paymentMethods,
  selectedPlanName,
  onSelectPaymentMethod,
  onAddPaymentMethod,
  onCancel
}) => {
  const [selectedSubscriptionPaymentMethodId, setSelectedSubscriptionPaymentMethodId] = useState<string | null>(
    paymentMethods.find(method => method.default)?.stripePaymentMethodId || null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubscriptionPaymentMethodId) {
      onSelectPaymentMethod(selectedSubscriptionPaymentMethodId);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>Complete Your Subscription</h3>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <div className="popup-content">
          <p>
            You've selected the <strong>{selectedPlanName}</strong> plan. 
            Please select a payment method to complete your subscription.
          </p>
          
          {paymentMethods.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="payment-methods-list">
                {paymentMethods.map(method => (
                  <div 
                    key={method.stripePaymentMethodId} 
                    className={`payment-method-item ${
                      selectedSubscriptionPaymentMethodId === method.stripePaymentMethodId ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedSubscriptionPaymentMethodId(method.stripePaymentMethodId)}
                  >
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value={method.stripePaymentMethodId}
                      checked={selectedSubscriptionPaymentMethodId === method.stripePaymentMethodId}
                      onChange={() => setSelectedSubscriptionPaymentMethodId(method.stripePaymentMethodId)}
                    />
                    <div className="payment-method-details">
                      <div className="card-brand">{method.cardBrand}</div>
                      <div className="card-last4">**** **** **** {method.cardLast4 || method.last4}</div>
                      <div className="card-expiry">Expires: {method.cardExpMonth}/{method.cardExpYear}</div>
                      {method.default && <span className="default-badge">Default</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="popup-actions">
                <button 
                  type="button" 
                  className="subscription-add-payment-method" 
                  onClick={onAddPaymentMethod}
                >
                  <span className="plus-icon"></span>
                  Add New Payment Method
                </button>
                <div className="action-buttons">
                  <button type="button" className="secondary-button" onClick={onCancel}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={!selectedSubscriptionPaymentMethodId}
                  >
                    Complete Subscription
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="no-payment-methods">
              <div className="alert-icon"></div>
              <p>You don't have any payment methods set up yet.</p>
              <button 
                className="subscription-add-payment-method primary" 
                onClick={onAddPaymentMethod}
              >
                <span className="plus-icon"></span>
                Add Payment Method
              </button>
              <button className="secondary-button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelectionPopup; 