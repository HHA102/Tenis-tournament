import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Token"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newAccessToken) => {
            originalRequest.headers["Token"] = `Bearer ${newAccessToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken);

        apiClient.defaults.headers["Token"] = `Bearer ${accessToken}`;
        onTokenRefreshed(accessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Handle token refresh failure (e.g., log out the user)
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
