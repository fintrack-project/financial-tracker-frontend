import axios from 'axios';

export const verifyEmailApi = async (token: string) => {
  return axios.post('/api/user/email/verify', { token });
};

export const checkEmailVerifiedApi = async (accountId: string) => {
  return axios.post('/api/user/email/verified', { accountId });
};

export const sendEmailVerificationApi = async (accountId: string, email: string) => {
  return axios.post('/api/user/email/send-verification', { accountId, email });
};