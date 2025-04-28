import React from 'react';
import PageTopBar from '../../components/Bar/PageTopBar';
import './Profile.css';

const Profile: React.FC = () => {
  const handleAccountChange = (accountId: string) => {
    console.log('Account changed to:', accountId);
  };

  return (
    <div className="profile-container">
      <PageTopBar onAccountChange={handleAccountChange} />
      <div className="profile-content">
        <h1>Profile</h1>
        <p>Welcome to your profile page. Here you can manage your account details.</p>
      </div>
    </div>
  );
};

export default Profile;