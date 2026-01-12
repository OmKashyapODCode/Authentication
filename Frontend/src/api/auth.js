import axios from "axios";

/**
 * Axios instance for Auth APIs
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. https://authentication-vl34.vercel.app/api/v1
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor for automatic token refresh
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, try refreshing once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/refresh");
        return api(originalRequest);
      } catch {
        // Refresh failed → force login
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/* ===========================
   AUTH API METHODS
=========================== */

export const register = (data) =>
  api.post("/register", data);

export const verifyEmail = (token) =>
  api.post(`/verify/${token}`);

export const login = (data) =>
  api.post("/login", data);

export const verifyOtp = (data) =>
  api.post("/verify", data);

export const getMyProfile = () =>
  api.get("/me");

export const logout = () =>
  api.post("/logout");

export const refresh = () =>
  api.post("/refresh");

export default api;
