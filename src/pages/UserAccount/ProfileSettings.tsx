import React, { useState } from 'react'
import ProfileSettingsNavigationBar from '../../components/Bar/ProfileSettingsNavigationBar';
import './ProfileSettings.css'; // Add styles for horizontal alignment

const ProfileSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('Profile Detail'); // Default section

  const renderContent = () => {
    switch (activeSection) {
      case 'Profile Detail':
        return <div className="profile-settings-content">Profile Detail Placeholder</div>;
      case 'Security':
        return <div className="profile-settings-content">Security Placeholder</div>;
      case 'Payment':
        return <div className="profile-settings-content">Payment Placeholder</div>;
      case 'Notification':
        return <div className="profile-settings-content">Notification Placeholder</div>;
      default:
        return <div className="profile-settings-content">Profile Detail Placeholder</div>;
    }
  };

  return (
    <div className="profile-settings">
      {/* Navigation Bar */}
      <ProfileSettingsNavigationBar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Content Area */}
      <div className="profile-settings-content-container">{renderContent()}</div>
    </div>
  );
};

export default ProfileSettings;