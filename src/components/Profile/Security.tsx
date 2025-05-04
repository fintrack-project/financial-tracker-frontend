import React, { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../services/userService';
import { UserDetails } from '../../types/UserDetails';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import { formatDate } from '../../utils/FormatDate';
import './Security.css'; // Add styles for the security section

interface SecurityProps {
  accountId: string; // Account ID to fetch user details
}

const Security: React.FC<SecurityProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDetails(accountId); // Use the service to fetch user details
        setUserDetails(data);
        setError(null);
      } catch (err) {
        setError('Failed to load security details. Please try again later.');
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [accountId]);

  if (loading) {
    return <p>Loading security details...</p>;
  }

  if (error) {
    return <p className="security-error">{error}</p>;
  }

  if (!userDetails) {
    return <p>No security details available.</p>;
  }

  const tableData = [
    { label: 'Two-Factor Authentication', value: userDetails.twoFactorEnabled ? 'Enabled' : 'Disabled' },
    { label: 'Last Login', value: formatDate(userDetails.lastLogin, true) || 'N/A' },
    {
      label: 'Password',
      value: '********', // Redacted password
      editable: false, // Password is not editable directly
      redacted: true, // Always redacted
    },
  ];

  return (
    <div className="security">
      <h2>Security Settings</h2>
      <ProfileTable data={tableData} />
    </div>
  );
};

export default Security;