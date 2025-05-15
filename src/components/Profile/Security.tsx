import React, { useEffect, useState } from 'react';
import { fetchUserDetails, updateTwoFactorStatus } from '../../services/userService';
import { UserDetails } from '../../types/UserDetails';
import { updatePassword } from '../../api/userApi';
import { setup2FA } from '../../api/twoFactorApi';
import { isStrongPassword } from '../../utils/validationUtils';
import QRCodePopup from '../../popup/QRCodePopup';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import Toggle from '../../components/Toggle/Toggle';
import IconButton from '../../components/Button/IconButton';
import OTPVerificationPopup from '../../popup/OTPVerificationPopup';
import PasswordInputPopup from '../../popup/PasswordInputPopup';
import { useAuthService } from '../../hooks/useAuthService';
import { formatDate } from '../../utils/FormatDate';
import './Security.css'; // Add styles for the security section

interface SecurityProps {
  accountId: string; // Account ID to fetch user details
}

const Security: React.FC<SecurityProps> = ({ accountId }) => {
  const {
    authenticate,
    verifyOtp,
    closeOtpPopup,
    showPasswordPopup,
    showOtpPopup,
    otpError,
  } = useAuthService();
  const [passwordHandlers, setPasswordHandlers] = useState<{
    handlePasswordConfirm: (password: string) => void;
    handlePasswordClose: () => void;
  } | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editState, setEditState] = useState<{ [key: string]: string | null }>({});
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
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

  const handleEditClick = (label: string, currentValue: string | null) => {
    if (label === 'Password') {
      const handlers = authenticate({
        accountId,
        twoFactorEnabled: userDetails?.twoFactorEnabled || false,
        onSuccess: () => {
          console.log('onSuccess callback called from handleEditClick');
          console.log('Authentication successful, enabling edit mode for password');
          setEditModes((prevModes) => ({ ...prevModes, [label]: true })); // Enable edit mode
          setEditState((prevState) => ({ ...prevState, [label]: '' })); // Initialize password field
        },
        onError: (error) => {
          alert(error);
        },
      });

      setPasswordHandlers(handlers); // Store the handlers for later use
    } else {
      setEditState((prevState) => ({ ...prevState, [label]: currentValue })); // Initialize other fields
      setEditModes((prevModes) => ({ ...prevModes, [label]: true })); // Enable edit mode for other fields
    }
  };

  const handleConfirmClick = async (label: string) => {
    if (!editModes[label]) {
      return; // Do nothing if the field is not in edit mode
    }

    const newValue = editState[label];

    try {
      if (label === 'Password') {
        console.log(`New value for ${label}:`, newValue);

        if (!newValue || newValue === '') {
          alert('Please enter a value.');
          return;
        }

        if (!isStrongPassword(newValue)) {
          alert('Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.');
          return;
        }

        // Call the backend API to update the password
        await updatePassword(accountId, newValue);
        alert('Password updated successfully!');

        // Reset the edit mode and state for the password field
        setEditState((prevState) => ({ ...prevState, [label]: null }));
        setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
      }
    } catch (error) {
      console.error(`Failed to update ${label}:`, error);
      alert(`Failed to update ${label}. Please try again.`);
    }
  };

  const handleCancelClick = (label: string, currentValue: string | null) => {
    setEditState((prevState) => ({ ...prevState, [label]: currentValue })); // Reset to the original value
    setEditModes((prevModes) => ({ ...prevModes, [label]: false })); // Disable edit mode for the field
  };

  const handleSetup2FA = async () => {
    try {
      const response = await setup2FA(accountId);
      setQrCode(response.data?.qrCode || null); // Display the QR code
    } catch (err) {
      console.error('Failed to setup 2FA:', err);
      alert('Failed to setup 2FA. Please try again.');
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
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'none' }}
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
      value: editModes['Password'] ? (
        <input
          type="password"
          value={editState['Password'] || ''}
          onChange={(e) =>
            setEditState((prevState) => ({ ...prevState, Password: e.target.value }))
          }
          placeholder="Enter new password"
        />
      ) : (
        '********' // Redacted password
      ),
      actions: editModes['Password'] ? (
        <div className="actions">
          <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Password')} />
          <IconButton type="cancel" label="Cancel" onClick={() => handleCancelClick('Password', null)} />
        </div>
      ) : (
        <div className="actions">
          <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Password', null)} />
        </div>
      ),
    }
  ];

  return (
    <div className="security">
      <h2>Security Settings</h2>
      <ProfileTable data={tableData} />
      {qrCode && (
        <QRCodePopup
          title="Scan QR Code"
          instructions="Scan this QR code with Google Authenticator to set up Two-Factor Authentication."
          qrCode={qrCode}
          onClose={() => setQrCode(null)}
        />
      )}
      {showPasswordPopup && passwordHandlers && (
        <PasswordInputPopup
          onConfirm={(password) => passwordHandlers.handlePasswordConfirm(password)}
          onClose={() => passwordHandlers.handlePasswordClose()}
        />
      )}
      {showOtpPopup && (
        <OTPVerificationPopup
          onVerify={(otp) => verifyOtp(accountId, otp)}
          onClose={closeOtpPopup}
          errorMessage={otpError}
        />
      )}
    </div>
  );
};

export default Security;