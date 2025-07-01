import React from 'react';
import './SubscriptionBasePopup.css';

interface SubscriptionBasePopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const SubscriptionBasePopup: React.FC<SubscriptionBasePopupProps> = ({
  title,
  onClose,
  children
}) => {
  return (
    <div className="subscription-popup-overlay">
      <div className="subscription-popup-container">
        <div className="subscription-popup-header">
          <h3>{title}</h3>
          <button className="subscription-close-button" onClick={onClose}>×</button>
        </div>
        <div className="subscription-popup-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBasePopup; 