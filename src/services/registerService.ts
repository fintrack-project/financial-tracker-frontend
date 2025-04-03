export interface RegisterRequest {
  userId: string;
  password: string;
  email: string;
  phone?: string;
  address?: string;
}

export const registerUser = async (registerData: RegisterRequest): Promise<string> => {
  try {
    const response = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed.');
    }

    return 'Registration successful!';
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};