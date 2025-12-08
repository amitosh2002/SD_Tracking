import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dispatch logout action if store is available
      if (window.store) {
        window.store.dispatch({ type: 'CLEAR_AUTH_STATE' });
      }
      
      // Redirect to auth page
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
