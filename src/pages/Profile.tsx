import React from 'react';
import './Profile.css';

interface ProfileProps {
  accountId: string | null; // Receive accountId as a prop
}

const Profile: React.FC<ProfileProps> = ({ accountId }) => {
  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Welcome to your profile page. Here you can manage your account details.</p>
    </div>
  );
};

export default Profile;