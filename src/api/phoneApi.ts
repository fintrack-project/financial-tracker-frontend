import axios from 'axios';

export const sendPhoneVerifiedApi = async (accountId: string) => {
  return axios.post('/api/user/phone/verified', { accountId });
};