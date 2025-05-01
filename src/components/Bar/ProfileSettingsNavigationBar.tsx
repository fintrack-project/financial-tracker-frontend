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
  const sections = ['Profile Detail', 'Security', 'Payment', 'Notification'];

  return (
    <div className="profile-settings-navigation-bar">
      {sections.map((section) => (
        <button
          key={section}
          className={`profile-settings-navigation-item ${
            activeSection === section ? 'active' : ''
          }`}
          onClick={() => onSectionChange(section)}
        >
          {section}
        </button>
      ))}
    </div>
  );
};

export default ProfileSettingsNavigationBar;