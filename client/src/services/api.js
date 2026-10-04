import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT bearer token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected server error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || null
    };
    return Promise.reject(customError);
  }
);

export default api;
