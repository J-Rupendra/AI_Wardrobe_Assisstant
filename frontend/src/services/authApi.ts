import axios from 'axios';
import { AuthResponse } from '../types/auth';

const apiClient = axios.create({
  baseURL: import.meta?.env?.VITE_API_URL || 'http://localhost:5000',
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/register', {
      username,
      password,
    });
    return response.data.data;
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', {
      username,
      password,
    });
    return response.data.data;
  },

  me: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data.data;
  },
};

export default authApi;
