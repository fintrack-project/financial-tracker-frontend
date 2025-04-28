import React from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import './Profile.css';

interface ProfileProps {
  accountId: string | null; // Receive accountId as a prop
}

const Profile: React.FC<ProfileProps> = ({ accountId }) => {
  const leftContent = (
    <div>
      <h2>Account Details</h2>
      <p>Account ID: {accountId}</p>
      <p>Other account-related information can go here.</p>
    </div>
  );

  const rightContent = (
    <div>
      <h2>Profile Settings</h2>
      <p>Welcome to your profile page. Here you can manage your account details, update your personal information, and more.</p>
    </div>
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Profile;