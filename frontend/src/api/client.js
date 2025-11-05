import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const TOKEN_KEY = 'md_token';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export { api, TOKEN_KEY };
