import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationBanner from '../NotificationBanner/NotificationBanner';
import './NotificationContainer.css';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationBanner
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
          showCloseButton={true}
        />
      ))}
    </div>
  );
};

export default NotificationContainer; 