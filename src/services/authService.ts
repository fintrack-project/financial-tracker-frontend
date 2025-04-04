export interface LoginRequest {
  userId: string;
  password: string;
}

export const loginUser = async (loginData: LoginRequest): Promise<string> => {
  try {
    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Login failed.');
    }

    return 'Login successful!';
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'An error occurred during login.');
    }
    throw new Error('An unknown error occurred during login.');
  }
};