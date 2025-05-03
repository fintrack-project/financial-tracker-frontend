import axios from 'axios';

// Fetch user details
export const fetchUserDetailsApi = async (accountId: string) => {
  return axios.post('/api/user/fetch', {
    accountId, // Send accountId directly in the request body
  });
};

// Update user's phone number
export const updateUserPhoneApi = async (accountId: string, phone: string, countryCode: string) => {
  return axios.post('/api/user/update-phone', {
    accountId,
    phone,
    countryCode,
  });
};

// Update user's address
export const updateUserAddressApi = async (accountId: string, address: string) => {
  return axios.post('/api/user/update-address', {
    accountId,
    address,
  });
};

// Update user's email
export const updateUserEmailApi = async (accountId: string, email: string) => {
  return axios.post('/api/user/update-email', {
    accountId,
    email,
  });
};