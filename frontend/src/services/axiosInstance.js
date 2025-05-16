import axios from "axios";

const baseURL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

// Request interceptor to add latest token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const res = await axios.post(`${baseURL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // Update header and retry original request
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token expired or invalid.");
        localStorage.clear();
        window.location.href = "/login"; // Force logout
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
