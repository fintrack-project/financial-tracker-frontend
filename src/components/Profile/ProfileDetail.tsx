import React, { useEffect, useState } from 'react';
import './ProfileDetail.css'; // Add styles for the profile detail section

interface ProfileDetailProps {
  accountId: string; // Account ID to fetch user details
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${accountId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUserDetails(data);
        setError(null);
      } catch (err) {
        setError('Failed to load user details. Please try again later.');
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
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
      <p><strong>Name:</strong> {userDetails.name}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Phone:</strong> {userDetails.phone}</p>
      <p><strong>Address:</strong> {userDetails.address}</p>
    </div>
  );
};

export default ProfileDetail;