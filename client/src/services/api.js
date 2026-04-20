import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally (e.g., unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic could go here to redirect to login if token is expired
      console.error('Unauthorized access. Redirecting...');
    }
    return Promise.reject(error);
  }
);

export default api;
