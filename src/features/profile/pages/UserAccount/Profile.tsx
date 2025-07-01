import React from 'react';
import BaseUserAccountPage from './BaseUserAccountPage';
import AccountDetailAndMenu from '../../../../components/Menu/AccountDetailAndMenu';
import ProfileSettings from './ProfileSettings';
import './Profile.css';

interface ProfileProps {
  accountId: string | null;
}

const Profile: React.FC<ProfileProps> = ({ accountId }) => {
  const leftContent = (
    <AccountDetailAndMenu
      accountId={accountId || 'Guest'}
    />
  );

  const rightContent = (
    <ProfileSettings 
      accountId={accountId || 'Guest'}
    />
  );

  return <BaseUserAccountPage leftContent={leftContent} rightContent={rightContent} />;
};

export default Profile;