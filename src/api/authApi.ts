import axios from 'axios';
import { LoginRequest } from '../types/Requests';

export const loginApi = async (loginData: LoginRequest) => {
  return axios.post('/api/user/login', loginData, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const registerApi = async (registerData: { userId: string; email: string; password: string }) => {
  return axios.post('/api/user/register', registerData);
};