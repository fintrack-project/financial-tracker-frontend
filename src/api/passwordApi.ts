import axios from 'axios';

export const verifyPassword = async (accountId: string, password: string) => {
  const response = await axios.post('/api/user/password/verify', { accountId, password });
  return response.data;
};