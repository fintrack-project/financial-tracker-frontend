import React, { useEffect, useState, useMemo } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { updateUserPhone, updateUserAddress, updateUserEmail } from '../../services/userService';
import { sendEmailVerification } from '../../services/authService';
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
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
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
    setEditModes((prevModes) => ({ ...prevModes, [label]: true })); // Enable edit mode for the field
  
  };

  const handleConfirmClick = async (label: string) => {
    if (!editModes[label]) {
      return; // Do nothing if the field is not in edit mode
    }
  
    const currentValue = userDetails![label.toLowerCase() as keyof UserDetails];
    const newValue = editState[label];
  
    // If no changes were made, exit edit mode without doing anything
    if (currentValue === newValue) {
      console.log(`No changes made for ${label}. Exiting edit mode.`);
      setEditState((prevState) => ({ ...prevState, [label]: currentValue }));
      setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
      return;
    }
  
    try {
      if (label === 'Phone') {
        // Validate phone number format
        const phoneRegex = /^\d{10}$/; // Example: 10-digit phone number
        if (!phoneRegex.test(newValue || '')) {
          alert('Invalid phone number format. Please enter a valid 10-digit phone number.');
          return; // Do not exit edit mode
        }
  
        console.log(`Updating Phone to: ${newValue}`);
        await updateUserPhone(accountId, newValue || '');
        setUserDetails((prev) => ({
          ...prev!,
          phone: newValue || '',
        }));
      }
  
      if (label === 'Address') {
        console.log(`Updating Address to: ${newValue}`);
        await updateUserAddress(accountId, newValue || '');
        setUserDetails((prev) => ({
          ...prev!,
          address: newValue || '',
        }));
      }
  
      if (label === 'Email') {
        if (!newValue) {
          alert('Email cannot be blank.');
          setEditState((prevState) => ({ ...prevState, [label]: null })); // Revert to previous value
          setEditModes((prevModes) => ({ ...prevModes, [label]: false })); // Exit edit mode for Email
          return;
        }
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newValue)) {
          alert('Invalid email format.');
          setEditState((prevState) => ({ ...prevState, [label]: null })); // Revert to previous value
          setEditModes((prevModes) => ({ ...prevModes, [label]: false })); // Exit edit mode for Email
          return;
        }
  
        const confirmChange = window.confirm('Are you sure you want to change your email?');
        if (!confirmChange) {
          setEditState((prevState) => ({ ...prevState, [label]: null })); // Revert to previous value
          setEditModes((prevModes) => ({ ...prevModes, [label]: false })); // Exit edit mode for Email
          return;
        }
  
        console.log(`Updating Email to: ${newValue}`);
        await updateUserEmail(accountId, newValue || '');
        setUserDetails((prev) => ({
          ...prev!,
          email: newValue || '',
        }));
  
        // Trigger email verification
        await sendEmailVerification(accountId, newValue || '');
        alert('A verification email has been sent to your new email address.');
      }
  
      // Exit edit mode for the field
      setEditState((prevState) => ({ ...prevState, [label]: null }));
      setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
      console.log(`Exiting edit mode for ${label}`);
    } catch (error) {
      console.error(`Failed to update ${label}:`, error);
      alert(`Failed to update ${label}. Please try again later.`);
    }
  };

  const tableData = useMemo(() => {
    if (!userDetails) return [];
  
    return [
      {
        label: 'User ID',
        value: userDetails.userId,
      },
      {
        label: 'Email',
        value:
          editModes['Email'] ? (
            <input
              type="text"
              value={editState['Email'] || ''}
              onChange={(e) => setEditState((prevState) => ({ ...prevState, Email: e.target.value }))}
            />
          ) : (
            userDetails.email
          ),
        status: userDetails.emailVerified ? (
          <span style={{ color: 'green' }}>Verified</span>
        ) : (
          <span style={{ color: 'red' }}>Not Verified</span>
        ),
        actions:
          editModes['Email'] ? (
            <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Email')} />
          ) : (
            <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Email', userDetails.email)} />
          ),
      },
      {
        label: 'Phone',
        value:
          editModes['Phone'] ? (
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
          editModes['Phone'] ? (
            <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Phone')} />
          ) : (
            <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Phone', userDetails.phone)} />
          ),
      },
      {
        label: 'Address',
        value:
          editModes['Address'] ? (
            <input
              type="text"
              value={editState['Address'] || ''}
              onChange={(e) => setEditState((prevState) => ({ ...prevState, Address: e.target.value }))}
            />
          ) : (
            userDetails.address
          ),
        actions:
          editModes['Address'] ? (
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
  }, [userDetails, editState]);

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
      <ProfileTable data={tableData} />
    </div>
  );
};

export default ProfileDetail;