import axios from 'axios';

export const createAccountApi = async (userId: string) => {
  return axios.post('/api/accounts/create', null, {
    params: { userId },
  });
};