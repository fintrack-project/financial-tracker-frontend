import React from 'react';
import './NotificationBanner.css';

interface NotificationBannerProps {
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  message,
  onClose,
  showCloseButton = true,
  className = ''
}) => {
  return (
    <div className={`notification-banner notification-banner--${type} ${className}`}>
      <div className="notification-banner-content">
        <span className="notification-banner-message">{message}</span>
        {showCloseButton && onClose && (
          <button 
            className="notification-banner-close"
            onClick={onClose}
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner; 