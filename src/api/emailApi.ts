import axios from 'axios';

export const verifyEmailApi = async (token: string) => {
  return axios.post('/api/user/email/verify', { token });
};

export const sendEmailVerificationApi = async (accountId: string, email: string) => {
  return axios.post('/api/user/email/send-verification', { accountId, email });
};