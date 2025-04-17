import axios from 'axios';

export interface RegisterRequest {
  userId: string;
  password: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CreateAccountRequest {
  userId: string;
  accountName: string;
}

export const registerUser = async (registerData: RegisterRequest): Promise<string> => {
  try {
    // Step 1: Register the user
    const registerResponse = await axios.post('/api/register', registerData);
    console.log('User registered successfully');

    // Step 2: Create an account for the registered user
    const createAccountResponse = await axios.post('/api/accounts/create', null, {
      params: { userId: registerData.userId },
    });

    console.log('Account created successfully:', createAccountResponse.data);

    return `Registration and account creation successful! Account ID: ${createAccountResponse.data.accountId}`;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};