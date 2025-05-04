import React, { useEffect, useState } from 'react';
import { fetchUserDetails, updateTwoFactorStatus } from '../../services/userService';
import { UserDetails } from '../../types/UserDetails';
import { setup2FA, verify2FA } from '../../api/twoFactorApi';
import QRCodePopup from '../../popup/QRCodePopup';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import Toggle from '../../components/Toggle/Toggle'; // Import the Toggle component
import { formatDate } from '../../utils/FormatDate';
import './Security.css'; // Add styles for the security section

interface SecurityProps {
  accountId: string; // Account ID to fetch user details
}

const Security: React.FC<SecurityProps> = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
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

  const handleSetup2FA = async () => {
    try {
      const data = await setup2FA(accountId);
      setQrCode(data.qrCode); // Display the QR code
    } catch (err) {
      console.error('Failed to setup 2FA:', err);
      alert('Failed to setup 2FA. Please try again.');
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      const result = await verify2FA(accountId, otp);
      if (result.success) {
        alert('2FA setup successfully!');
        setQrCode(null); // Close the popup
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error('Failed to verify OTP:', err);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  const handleToggle2FA = async () => {
    const enabled = !userDetails?.twoFactorEnabled; // Toggle the 2FA status
    try {
      await updateTwoFactorStatus(accountId, enabled); // Call the service to update 2FA status
      setUserDetails((prev) => prev && { ...prev, twoFactorEnabled: enabled }); // Update local state
    } catch (err) {
      console.error('Failed to update 2FA status:', err);
      alert('Failed to update 2FA status. Please try again later.');
    }
  };

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
    {
      label: 'Two-Factor Authentication',
      value: userDetails.twoFactorEnabled ? 'Enabled' : 'Disabled',
      status: userDetails.twoFactorEnabled ? (
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={handleSetup2FA} // Trigger QR code setup
        >
          Setup Google OTP
        </span>
      ) : (
        ''
      ),
      actions: (
        <Toggle
          label="2FA"
          isEnabled={userDetails.twoFactorEnabled}
          onToggle={() => handleToggle2FA()}
        />
      ),
    },
    { label: 'Last Login', 
      value: formatDate(userDetails.lastLogin, true) || 'N/A' 
    },
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
      {qrCode && (
        <QRCodePopup
          qrCode={qrCode}
          onClose={() => setQrCode(null)} // Close the popup
        />
      )}
    </div>
  );
};

export default Security;