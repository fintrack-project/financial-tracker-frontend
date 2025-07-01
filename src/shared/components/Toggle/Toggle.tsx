import React from 'react';
import './Toggle.css';

interface ToggleProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const NotificationToggle: React.FC<ToggleProps> = ({ label, isEnabled, onToggle }) => {
  return (
    <div className="toggle">
      <span className="toggle-label">{label}</span>
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