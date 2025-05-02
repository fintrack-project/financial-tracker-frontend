import React, { useState } from 'react'
import ProfileSettingsNavigationBar from '../../components/Bar/ProfileSettingsNavigationBar';
import ProfileDetail from '../../components/Profile/ProfileDetail'; // Import ProfileDetail component
import Security from '../../components/Profile/Security';
import Payment from '../../components/Profile/Payment';
import Notification from '../../components/Profile/Notification';
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
        return <Payment accountId={accountId} />;
      case 'Notification':
        return <Notification accountId={accountId} />;
      default:
        return <ProfileDetail accountId={accountId} />;
    }
  };

  return (
    <div className="profile-settings">
      <ProfileSettingsNavigationBar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      {renderContent()}
    </div>
  );
};

export default ProfileSettings;