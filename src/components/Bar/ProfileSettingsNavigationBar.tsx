import React from 'react';
import './ProfileSettingsNavigationBar.css';

interface ProfileSettingsNavigationBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileSettingsNavigationBar: React.FC<ProfileSettingsNavigationBarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const sections = ['Profile Detail', 'Security', 'Subscription', 'Notification'];

  return (
    <div className="profile-settings-nav">
      {sections.map((section) => (
        <button
          key={section}
          className={`nav-button ${activeSection === section ? 'active' : ''}`}
          onClick={() => onSectionChange(section)}
        >
          {section}
        </button>
      ))}
    </div>
  );
};

export default ProfileSettingsNavigationBar;