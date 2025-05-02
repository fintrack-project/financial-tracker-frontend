import React from 'react';
import './NotificationToggle.css';

interface NotificationToggleProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ label, isEnabled, onToggle }) => {
  return (
    <div className="notification-toggle">
      <span className="notification-label">{label}</span>
      <div
        className={`toggle-switch ${isEnabled ? 'enabled' : 'disabled'}`}
        onClick={onToggle}
        role="button"
        aria-pressed={isEnabled}
      >
        <div className="toggle-knob"></div>
      </div>
    </div>
  );
};

export default NotificationToggle;