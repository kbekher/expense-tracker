import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

// Register with email/password
export const register = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

// Login with email/password
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

// Google OAuth
export const googleAuth = async (credential: string, email: string, name: string, picture?: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/google`, {
    credential,
    email,
    name,
    picture,
  });
  return response.data;
};

// Get current user
export const getCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

