import React from 'react';
import SubscriptionBasePopup from './SubscriptionBasePopup';
import './SubscriptionBasePopup.css';

interface SubscriptionNoPaymentMethodPopupProps {
  selectedPlanName: string;
  onRedirectToPayment: () => void;
  onCancel: () => void;
}

const NoPaymentMethodPopup: React.FC<SubscriptionNoPaymentMethodPopupProps> = ({
  selectedPlanName,
  onRedirectToPayment,
  onCancel
}) => {
  return (
    <SubscriptionBasePopup
      title="Payment Method Required"
      onClose={onCancel}
    >
      <div className="subscription-content-centered">
        <div className="subscription-alert-icon"></div>
        <p>
          You've selected the <strong>{selectedPlanName}</strong> plan.
        </p>
        <p>
          A payment method is required to subscribe to paid plans. Would you like to add a payment method now?
        </p>
      </div>
      
      <div className="subscription-action-buttons">
        <button type="button" className="subscription-secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button 
          type="button" 
          className="subscription-primary-button"
          onClick={onRedirectToPayment}
        >
          <span className="subscription-plus-icon"></span>
          Add Payment Method
        </button>
      </div>
    </SubscriptionBasePopup>
  );
};

export default NoPaymentMethodPopup; 