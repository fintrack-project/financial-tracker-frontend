import axios from 'axios';

export const setup2FA = async (accountId: string) => {
  const response = await axios.post('/api/user/2fa/setup', { accountId });
  return response.data; // Contains secret and QR code
};

export const verify2FA = async (accountId: string, otp: string) => {
  const response = await axios.post('/api/user/2fa/verify', { accountId, otp });
  return response.data;
};