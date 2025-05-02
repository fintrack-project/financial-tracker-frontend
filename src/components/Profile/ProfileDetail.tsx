import React, { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { UserDetails } from '../../types/UserDetails';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import IconButton from '../../components/Button/IconButton';
import './ProfileDetail.css'; // Add styles for the profile detail section

interface ProfileDetailProps {
  accountId: string; // Account ID to fetch user details
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [editState, setEditState] = useState<{ [key: string]: string | null }>({});
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

  const handleEditClick = (label: string, currentValue: string | null) => {
    setEditState((prevState) => ({ ...prevState, [label]: currentValue })); // Enable edit mode for the row
  };

  const handleConfirmClick = (label: string) => {
    if (editState[label] !== undefined) {
      console.log(`Updated ${label} to ${editState[label]}`);
      // Add logic to update the backend or state here
      setUserDetails((prev) => ({
        ...prev!,
        [label.toLowerCase() as keyof UserDetails]: editState[label] || '',
      }));
      setEditState((prevState) => ({ ...prevState, [label]: null })); // Exit edit mode
    }
  };

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
    {
      label: 'User ID',
      value: userDetails.userId,
    },
    {
      label: 'Email',
      value:
        editState['Email'] !== undefined ? (
          <input
            type="text"
            value={editState['Email'] || ''}
            onChange={(e) => setEditState((prevState) => ({ ...prevState, Email: e.target.value }))}
          />
        ) : (
          userDetails.email
        ),
      status: userDetails.emailVerifed ? (
        <span style={{ color: 'green' }}>Verified</span>
      ) : (
        <span style={{ color: 'red' }}>Not Verified</span>
      ),
      actions:
        editState['Email'] !== undefined ? (
          <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Email')} />
        ) : (
          <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Email', userDetails.email)} />
        ),
    },
    {
      label: 'Phone',
      value:
        editState['Phone'] !== undefined ? (
          <input
            type="text"
            value={editState['Phone'] || ''}
            onChange={(e) => setEditState((prevState) => ({ ...prevState, Phone: e.target.value }))}
          />
        ) : (
          userDetails.phone
        ),
      status: userDetails.phoneVerified ? (
        <span style={{ color: 'green' }}>Verified</span>
      ) : (
        <span style={{ color: 'red' }}>Not Verified</span>
      ),
      actions:
        editState['Phone'] !== undefined ? (
          <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Phone')} />
        ) : (
          <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Phone', userDetails.phone)} />
        ),
    },
    {
      label: 'Address',
      value:
        editState['Address'] !== undefined ? (
          <input
            type="text"
            value={editState['Address'] || ''}
            onChange={(e) => setEditState((prevState) => ({ ...prevState, Address: e.target.value }))}
          />
        ) : (
          userDetails.address
        ),
      actions:
        editState['Address'] !== undefined ? (
          <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Address')} />
        ) : (
          <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Address', userDetails.address)} />
        ),
    },
    {
      label: 'Account Tier',
      value: userDetails.accountTier,
    },
    {
      label: 'Signup Date',
      value: userDetails.signupDate,
    },
    {
      label: 'Last Activity',
      value: userDetails.lastActivityDate,
    },
  ];

  return (
    <div className="profile-detail">
      <h2>User Details</h2>
      <ProfileTable data={tableData} />
    </div>
  );
};

export default ProfileDetail;