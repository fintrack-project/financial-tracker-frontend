import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

// Create an axios instance with default config
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, application/*+json'
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
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
  (response) => {
    // Log successful responses for debugging
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // Enhanced error logging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      request: error.request,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access
      sessionStorage.removeItem('authToken');
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