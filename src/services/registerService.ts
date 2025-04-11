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
    const registerResponse = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(errorData.message || 'Registration failed.');
    }
    console.log('User registered successfully');

    // Step 2: Create an account for the registered user
    const createAccountResponse = await fetch(
      `http://localhost:8080/api/accounts/create?userId=${encodeURIComponent(registerData.userId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!createAccountResponse.ok) {
      const errorData = await createAccountResponse.json();
      throw new Error(errorData.error || 'Account creation failed.');
    }

    const createAccountData = await createAccountResponse.json();
    console.log('Account created successfully:', createAccountData);

    return `Registration and account creation successful! Account ID: ${createAccountData.accountId}`;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};