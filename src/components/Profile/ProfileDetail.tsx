import React, { useEffect, useState } from 'react';
import { fetchUserDetails, UserDetails } from '../../services/userService';
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

  return (
    <div className="profile-detail">
      <h2>User Details</h2>
      <div className="profile-detail-info">
        <p><strong>ID:</strong> {userDetails.userId}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Phone:</strong> {userDetails.phone}</p>
        <p><strong>Address:</strong> {userDetails.address}</p>
      </div>
    </div>
  );
};

export default ProfileDetail;