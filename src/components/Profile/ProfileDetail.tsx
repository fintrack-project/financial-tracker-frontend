import React, { useEffect, useState, useMemo } from 'react';
import useUserDetails from '../../hooks/useUserDetails';
import { updateUserPhone, updateUserAddress, updateUserEmail } from '../../services/userService';
import useVerification from '../../hooks/useVerification';
import { useAuthService } from '../../hooks/useAuthService';
import { UserDetails } from '../../types/UserDetails';
import ProfileTable from '../../components/Table/ProfileTable/ProfileTable';
import IconButton from '../../components/Button/IconButton';
import { isValidEmail } from '../../utils/validationUtils';
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import EmailVerificationPopup from '../../popup/EmailVerificationPopup';
import PhoneVerificationPopup from '../../popup/PhoneVerificationPopup';
import PasswordInputPopup from '../../popup/PasswordInputPopup';
import OTPVerificationPopup from '../../popup/OTPVerificationPopup';
import AccountTier from '../../components/Profile/AccountTier';
import { formatDate } from '../../utils/FormatDate';
import './ProfileDetail.css'; // Add styles for the profile detail section

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
  const {
    authenticate,
    verifyOtp,
    closeOtpPopup,
    showPasswordPopup,
    passwordError,
    showOtpPopup,
    otpError,
  } = useAuthService();
  const [countries, setCountries] = useState<{ code: string; phoneCode: string }[]>([]);
  const [editState, setEditState] = useState<{ [key: string]: string | null }>({});
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const [isFetch, setIsFetch] = useState(false); // Boolean to control fetching

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

  // const handleEditClick = (label: string, currentValue: string | null) => {
  //   if (label === 'Phone') {
  //     setEditState((prevState) => ({
  //       ...prevState,
  //       [label]: userDetails?.phone || '', // Initialize the phone number
  //       CountryCode: userDetails?.countryCode || 'US', // Initialize the country code
  //     }));
  //   } else {
  //     setEditState((prevState) => ({ ...prevState, [label]: currentValue })); // Initialize other fields
  //   }
  //   setEditModes((prevModes) => ({ ...prevModes, [label]: true })); // Enable edit mode for the field
  // };
  const handleEditClick = (label: string, currentValue: string | null) => {
    if (label === 'Email' || label === 'Phone' || label === 'Address') {
      authenticate({
        accountId,
        twoFactorEnabled: userDetails?.twoFactorEnabled || false,
        onSuccess: () => {
          // Enable edit mode and initialize the field value after successful verification
          setEditModes((prevModes) => ({ ...prevModes, [label]: true }));
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
          alert(error); // Display error message if verification fails
        },
      });
    } else {
      // For other fields, directly enable edit mode
      setEditState((prevState) => ({ ...prevState, [label]: currentValue }));
      setEditModes((prevModes) => ({ ...prevModes, [label]: true }));
    }
  };

  const handleConfirmClick = async (label: string) => {
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
          alert('Invalid phone number. Please enter a valid phone number.');
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
        sendVerification('phone', `+${getCountryCallingCode(countryCode as CountryCode)}${phoneNumber}`); // Use the hook function
        setIsFetch(true); // Set isFetch to true to trigger refreshUserDetails
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
          alert('Email cannot be blank.');
          setEditState((prevState) => ({ ...prevState, [label]: null })); // Revert to previous value
          setEditModes((prevModes) => ({ ...prevModes, [label]: false })); // Exit edit mode for Email
          return;
        }
  
        if (!isValidEmail(newValue)) {
          console.error(`Invalid email format:`, newValue);
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
        sendVerification('email'); // Use the hook function
        setIsFetch(true); // Set isFetch to true to trigger refreshUserDetails
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
        setIsFetch(true); // Set isFetch to true to trigger refreshUserDetails
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

  const handleVerificationClick = (type: 'phone' | 'email') => {
    sendVerification(type);
  };

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
        value: <AccountTier tier={userDetails.accountTier as 'free' | 'premium'} />, // Use AccountTier component
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
      {showPasswordPopup && (
        <PasswordInputPopup
          onConfirm={(password) => {
            const { handlePasswordConfirm } = authenticate({
              accountId,
              twoFactorEnabled: userDetails?.twoFactorEnabled || false,
              onSuccess: () => {},
              onError: () => {},
            });
            handlePasswordConfirm(password);
          }}
          onClose={() => {
            const { handlePasswordClose } = authenticate({
              accountId,
              twoFactorEnabled: userDetails?.twoFactorEnabled || false,
              onSuccess: () => {},
              onError: () => {},
            });
            handlePasswordClose();
          }}
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