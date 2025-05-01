import React, { useEffect, useState } from 'react';
import { fetchUserDetails, UserDetails } from '../../services/userService';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import './ProfileDetail.css'; // Add styles for the profile detail section

interface ProfileDetailProps {
  accountId: string; // Account ID to fetch user details
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDetails(accountId); // Use the service to fetch user details

        console.log('Fetched user details:', data);

        setUserDetails(data);
        setError(null);
      } catch (err) {
        setError('Failed to load user details. Please try again later.');
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [accountId]);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return <p className="profile-detail-error">{error}</p>;
  }

  if (!userDetails) {
    return <p>No user details available.</p>;
  }

  const tableData = [
    { label: 'User ID', value: userDetails.userId },
    { label: 'Email', value: userDetails.email, editable: true },
    { label: 'Phone', value: userDetails.phone, editable: true },
    { label: 'Address', value: userDetails.address, editable: true },
    { label: 'Account Tier', value: userDetails.accountTier },
    { label: 'Signup Date', value: userDetails.signupDate },
    { label: 'Last Activity', value: userDetails.lastActivityDate },
  ];

  const handleEditConfirm = (label: string, newValue: string) => {
    console.log(`Updated ${label} to ${newValue}`);
    // Add logic to update the backend or state here
  };

  return (
    <div className="profile-detail">
      <h2>User Details</h2>
      <ProfileTable data={tableData} onEditConfirm={handleEditConfirm} />
    </div>
  );
};

export default ProfileDetail;