import React, { useEffect, useState, useMemo, useCallback } from 'react';
import useUserDetails from '../../../../shared/hooks/useUserDetails';
import { updateUserPhone, updateUserAddress, updateUserEmail } from '../../../auth/services/userService';
import useVerification from '../../../../shared/hooks/useVerification';
import { UserDetails } from '../../../../shared/types/UserDetails';
import ProfileTable from '../../../../shared/components/Table/ProfileTable/ProfileTable';
import IconButton from '../../../../shared/components/Button/IconButton';
import { isValidEmail } from '../../../../shared/utils/validationUtils';
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import EmailVerificationPopup from '../../../auth/components/Popup/EmailVerificationPopup';
import PhoneVerificationPopup from '../../../auth/components/Popup/PhoneVerificationPopup';
import PasswordInputPopup from '../../../auth/components/Popup/PasswordInputPopup';
import OTPVerificationPopup from '../../../auth/components/Popup/OTPVerificationPopup';
import AccountTier from './AccountTier';
import { formatDate } from '../../../../shared/utils/FormatDate';
import './ProfileDetail.css'; // Add styles for the profile detail section
import { useAuthService } from '../../../auth/hooks/useAuthService';
import NotificationBanner from '../../../../shared/components/NotificationBanner/NotificationBanner';
import { useNotification } from '../../../../shared/contexts/NotificationContext';

interface ProfileDetailProps {
  accountId: string; // Account ID to fetch user details
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ accountId }) => {
  const { 
    userDetails, 
    setUserDetails, 
    loading, 
    error, 
    refreshUserDetails 
  } = useUserDetails(accountId); // Use the custom hook
  const {
    showPopup,
    sendVerification,
    resendVerification,
    verifyCode,
    closePopup,
  } = useVerification(accountId, userDetails, setUserDetails);
  const [passwordHandlers, setPasswordHandlers] = useState<{
    handlePasswordConfirm: (password: string) => void;
    handlePasswordClose: () => void;
  } | null>(null);
  const [countries, setCountries] = useState<{ code: string; phoneCode: string }[]>([]);
  const [editState, setEditState] = useState<{ [key: string]: string | null }>({});
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const [isFetch, setIsFetch] = useState(false); // Boolean to control fetching
  const [showEmailNotification, setShowEmailNotification] = useState(true);
  const {
    authenticate,
    verifyOtp,
    closeOtpPopup,
    showPasswordPopup,
    passwordError,
    showOtpPopup,
    otpError,
  } = useAuthService();
  const { showNotification } = useNotification();

  // Load countries data
  useEffect(() => {
    const loadCountries = () => {
      const countryList = getCountries().map((code) => ({
        code,
        phoneCode: `+${getCountryCallingCode(code)}`,
      }));
      setCountries(countryList);
    };

    loadCountries();
  }, [accountId]);

  // Trigger refreshUserDetails when isFetch is true
  useEffect(() => {
    if (isFetch) {
      const fetchDetails = async () => {
        await refreshUserDetails();
        setIsFetch(false); // Reset isFetch after fetching
      };
      fetchDetails();
    }
  }, [isFetch, refreshUserDetails]);

  const handleEditClick = useCallback((label: string, currentValue: string | null) => {
    if (label === 'Email' || label === 'Phone' || label === 'Address') {
      const handlers = authenticate({
        accountId,
        twoFactorEnabled: userDetails?.twoFactorEnabled || false,
        onSuccess: () => {
          console.log('onSuccess callback called from handleEditClick');
          console.log('Authentication successful, enabling edit mode for', label);
          // Enable edit mode and initialize the field value after successful verification
          setEditModes((prevModes) => {
            return { ...prevModes, [label]: true };
          });
  
          if (label === 'Phone') {
            setEditState((prevState) => ({
              ...prevState,
              [label]: userDetails?.phone || '',
              CountryCode: userDetails?.countryCode || 'US',
            }));
          } else {
            setEditState((prevState) => ({ ...prevState, [label]: currentValue }));
          }
        },
        onError: (error) => {
          console.error(`Authentication failed for ${label}:`, error);
          showNotification('error', error, 5000);
        },
      });

      setPasswordHandlers(handlers); // Store the handlers for later use
    } else {
      // For other fields, directly enable edit mode
      setEditState((prevState) => ({ ...prevState, [label]: currentValue }));
      setEditModes((prevModes) => ({ ...prevModes, [label]: true }));
    }
  }, [accountId, userDetails, authenticate, showNotification]);

  const handleConfirmClick = useCallback(async (label: string) => {
    if (!editModes[label]) {
      return; // Do nothing if the field is not in edit mode
    }
  
    const currentValue = userDetails![label.toLowerCase() as keyof UserDetails];
    const newValue = editState[label];
  
    try {
      if (label === 'Phone') {
        const countryCode = editState['CountryCode'] || 'US';
        const phoneNumber = editState['Phone'] || '';
  
        // Parse the current and new phone numbers
        const currentPhoneNumber = parsePhoneNumberFromString(
          `+${getCountryCallingCode(userDetails?.countryCode as CountryCode || 'US')}${userDetails?.phone}`
        );
        const newPhoneNumber = parsePhoneNumberFromString(`+${getCountryCallingCode(countryCode as CountryCode)}${phoneNumber}`);
  
        // If no changes were made, exit edit mode without doing anything
        if (currentPhoneNumber?.number === newPhoneNumber?.number) {
          console.log(`No changes made for ${label}. Exiting edit mode.`);
          setEditState((prevState) => ({ ...prevState, [label]: null }));
          setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
          return;
        }
  
        // Validate phone number
        const parsedPhoneNumber = parsePhoneNumberFromString(
          `+${getCountryCallingCode(countryCode as CountryCode)}${phoneNumber}`
        );
        if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
          showNotification('error', 'Invalid phone number. Please enter a valid phone number.', 5000);
          return;
        }
  
        console.log(`Updating Phone to: ${parsedPhoneNumber?.number}`);
        await updateUserPhone(accountId, phoneNumber, countryCode);
        setUserDetails((prev) => ({
          ...prev!,
          phone: phoneNumber,
          countryCode: countryCode,
        }));
  
        // Trigger SMS verification
        sendVerification('phone', `+${getCountryCallingCode(countryCode as CountryCode)}${phoneNumber}`);
        setIsFetch(true);
      }
  
      if (label === 'Email') {
        // If no changes were made, exit edit mode without doing anything
        if (currentValue === newValue) {
          console.log(`No changes made for ${label}. Exiting edit mode.`);
          setEditState((prevState) => ({ ...prevState, [label]: currentValue }));
          setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
          return;
        }
  
        if (!newValue) {
          showNotification('error', 'Email cannot be blank.', 5000);
          setEditState((prevState) => ({ ...prevState, [label]: null }));
          setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
          return;
        }
  
        if (!isValidEmail(newValue)) {
          console.error(`Invalid email format:`, newValue);
          showNotification('error', 'Invalid email format.', 5000);
          setEditState((prevState) => ({ ...prevState, [label]: null }));
          setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
          return;
        }
  
        const confirmChange = window.confirm('Are you sure you want to change your email?');
        if (!confirmChange) {
          setEditState((prevState) => ({ ...prevState, [label]: null }));
          setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
          return;
        }
  
        console.log(`Updating Email to: ${newValue}`);
        await updateUserEmail(accountId, newValue || '');
        setUserDetails((prev) => ({
          ...prev!,
          email: newValue || '',
        }));
  
        // Trigger email verification
        sendVerification('email');
        setIsFetch(true);
      }

      if (label === 'Address') {
        // If no changes were made, exit edit mode without doing anything
        if (currentValue === newValue) {
          console.log(`No changes made for ${label}. Exiting edit mode.`);
          setEditState((prevState) => ({ ...prevState, [label]: currentValue }));
          setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
          return;
        }
  
        console.log(`Updating Address to: ${newValue}`);
        await updateUserAddress(accountId, newValue || '');
        setUserDetails((prev) => ({
          ...prev!,
          address: newValue || '',
        }));
        setIsFetch(true);
      }
  
      // Exit edit mode for the field
      setEditState((prevState) => ({ ...prevState, [label]: null }));
      setEditModes((prevModes) => ({ ...prevModes, [label]: false }));
      console.log(`Exiting edit mode for ${label}`);
    } catch (error) {
      console.error(`Failed to update ${label}:`, error);
              showNotification('error', `Failed to update ${label}. Please try again later.`, 5000);
    }
  }, [accountId, editModes, editState, userDetails, sendVerification, setUserDetails, showNotification]);

  const handleVerificationClick = useCallback((type: 'phone' | 'email') => {
    sendVerification(type);
  }, [sendVerification]);

  const handlePopupResend = () => {
    resendVerification();
  };

  const handlePopupVerify = async (verificationCode: string): Promise<boolean> => {
    return await verifyCode(verificationCode); // Call the hook function and return its result
  };

  const handlePopupClose = () => {
    closePopup();
    setIsFetch(true); // Set isFetch to true to trigger refreshUserDetails
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
          <span
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={() => handleVerificationClick('email')}
          >
            Not Verified
          </span>
        ),
        actions:
          (
            <div className="actions">
              {editModes['Email'] ? (
                  <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Email')} />
              ) : (
                <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Email', userDetails.email)} />
              )}
            </div>
          ),
      },
      {
        label: 'Phone',
        value:
          editModes['Phone'] ? (
            <div className="phone-input-container">
              <select
                value={editState['CountryCode'] || ''}
                onChange={(e) =>
                  setEditState((prevState) => ({
                    ...prevState,
                    CountryCode: e.target.value,
                  }))
                }
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.phoneCode})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={editState['Phone'] || ''}
                onChange={(e) =>
                  setEditState((prevState) => ({
                    ...prevState,
                    Phone: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            `(${userDetails.countryCode} +${getCountryCallingCode(userDetails.countryCode as CountryCode || 'US')}) ${userDetails.phone}`
          ),
        status: userDetails.phoneVerified ? (
          <span style={{ color: 'green' }}>Verified</span>
        ) : (
          <span
            style={{ color: 'red', cursor: 'pointer'}}
            onClick={() => handleVerificationClick('phone')}
          >
            Not Verified
          </span>
        ),
        actions:
        (
          <div className="actions">
            {editModes['Phone'] ? (
              <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Phone')} />
            ) : (
              <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Phone', userDetails.phone)} />
            )}
          </div>
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
        (
          <div className="actions">
            {editModes['Address'] ? (
              <IconButton type="confirm" label="Confirm" onClick={() => handleConfirmClick('Address')} />
            ) : (
              <IconButton type="edit" label="Edit" onClick={() => handleEditClick('Address', userDetails.address)} />
            )}
          </div>
        ),
      },
      {
        label: 'Account Tier',
        value: <AccountTier accountId={accountId} />, // Use AccountTier component with accountId
      },
      {
        label: 'Signup Date',
        value: formatDate(userDetails.signupDate),
      },
      {
        label: 'Last Activity',
        value: formatDate(userDetails.lastActivityDate),
      },
    ];
  }, [
    userDetails,
    editState,
    editModes,
    countries,
    handleVerificationClick,
    handleEditClick,
    handleConfirmClick,
    accountId
  ]);

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
      {showEmailNotification && !userDetails.emailVerified && (
        <NotificationBanner
          type="info"
          message="Your email is not verified. You can verify your email address in your profile settings for enhanced security and account recovery options."
          onClose={() => setShowEmailNotification(false)}
          showCloseButton={true}
        />
      )}
      <ProfileTable data={tableData} />
      {showPopup === 'phone' && (
        <PhoneVerificationPopup
          onClose={handlePopupClose}
          onVerify={handlePopupVerify}
          onResend={handlePopupResend}
        />
      )}
      {showPopup === 'email' && (
        <EmailVerificationPopup
          onClose={handlePopupClose}
          onResend={handlePopupResend}
        />
      )}
      {showPasswordPopup && passwordHandlers && (
        <PasswordInputPopup
          onConfirm={(password) => passwordHandlers.handlePasswordConfirm(password)}
          onClose={() => passwordHandlers.handlePasswordClose()}
          errorMessage={passwordError}
        />
      )}
      {showOtpPopup && (
        <OTPVerificationPopup
          onVerify={(otp) => verifyOtp(accountId, otp)}
          onClose={closeOtpPopup}
          errorMessage={otpError}
        />
      )}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
    </div>
  );
};

export default ProfileDetail;