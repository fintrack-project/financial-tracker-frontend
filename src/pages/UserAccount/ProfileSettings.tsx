import React, { useState } from 'react'
import ProfileSettingsNavigationBar from '../../components/Bar/ProfileSettingsNavigationBar';
import ProfileDetail from '../../components/Profile/ProfileDetail'; // Import ProfileDetail component
import Security from '../../components/Profile/Security';
import './ProfileSettings.css'; // Add styles for horizontal alignment

interface ProfileSettingsProps {
  accountId: string; // Pass accountId to fetch user details
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ accountId }) => {
  const [activeSection, setActiveSection] = useState<string>('Profile Detail'); // Default section

  const renderContent = () => {
    switch (activeSection) {
      case 'Profile Detail':
        return <ProfileDetail accountId={accountId} />;
      case 'Security':
        return <Security accountId={accountId} />;
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