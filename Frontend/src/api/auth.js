import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post('/api/v1/refresh', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/register', data);

export const verifyEmail = (token) => api.post(`/verify/${token}`);

export const login = (data) => api.post('/login', data);

export const verifyOtp = (data) => api.post('/verify', data);

export const getMyProfile = () => api.get('/me');

export const logout = () => api.post('/logout');

export const refresh = () => api.post('/refresh');