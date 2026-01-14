import axios from "axios";

const server = "https://authentication-odcode.onrender.com/api/v1";

/* ---------------- COOKIE HELPER ---------------- */
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

/* ---------------- AXIOS INSTANCE ---------------- */
const api = axios.create({
  baseURL: server,
  withCredentials: true,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use(
  (config) => {
    if (["post", "put", "delete"].includes(config.method)) {
      const csrfToken = getCookie("csrfToken");
      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- REFRESH STATE ---------------- */
let isRefreshing = false;
let isRefreshingCSRFToken = false;
let failedQueue = [];
let csrfFailedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

const processCSRFQueue = (error) => {
  csrfFailedQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve()
  );
  csrfFailedQueue = [];
};

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (originalRequest?.url?.includes("/refresh") && status === 401) {
      return Promise.reject(error);
    }

    /* Handle CSRF errors */
    if (status === 403 && !originalRequest._retry) {
      const errorCode = error.response?.data?.code || "";

      if (errorCode.startsWith("CSRF_")) {
        if (isRefreshingCSRFToken) {
          return new Promise((resolve, reject) => {
            csrfFailedQueue.push({ resolve, reject });
          }).then(() => api(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshingCSRFToken = true;

        try {
          await api.post("/refresh-csrf");
          processCSRFQueue(null);
          return api(originalRequest);
        } catch (err) {
          processCSRFQueue(err);
          return Promise.reject(err);
        } finally {
          isRefreshingCSRFToken = false;
        }
      }
    }

    const isPublicRoute =
      originalRequest.url.includes("/send-otp") ||
      originalRequest.url.includes("/verify-otp") ||
      originalRequest.url.includes("/login") ||
      originalRequest.url.includes("/register");

    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !isPublicRoute
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api;
