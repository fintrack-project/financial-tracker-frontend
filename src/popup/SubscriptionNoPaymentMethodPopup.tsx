import React from 'react';
import './SubscriptionPaymentMethodPopupStyle.css';

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
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>Payment Method Required</h3>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="content-centered">
            <div className="alert-icon"></div>
            <p>
              You've selected the <strong>{selectedPlanName}</strong> plan.
            </p>
            <p>
              A payment method is required to subscribe to paid plans. Would you like to add a payment method now?
            </p>
          </div>
          
          <div className="action-buttons" style={{ marginTop: '28px' }}>
            {/* Primary action on left, cancel on right (because of flex-direction: row-reverse in CSS) */}
            <button type="button" className="secondary-button" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="button" 
              className="primary-button"
              onClick={onRedirectToPayment}
            >
              <span className="plus-icon"></span>
              Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoPaymentMethodPopup; 