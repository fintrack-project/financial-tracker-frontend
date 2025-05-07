import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

// Create an axios instance with default config
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Extract error message from response
    const errorMessage = typeof error.response?.data === 'string' 
      ? error.response.data
      : error.response?.data?.message || 
        error.message || 
        'An error occurred';

    throw new Error(errorMessage);
  }
); 