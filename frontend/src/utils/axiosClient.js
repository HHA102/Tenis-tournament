import axios from "axios";
import { store } from "../redux/store";
import { setAccessToken } from "../redux/authSlice";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const saveNewAccessToken = (token) => {
    store.dispatch(setAccessToken(token));
};

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = store.getState()?.auth?.login?.accessToken;
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true; // Prevent infinite loop

            try {
                const res = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {}, { withCredentials: true });
                const newAccessToken = res.data.accessToken;
                saveNewAccessToken(newAccessToken);
                // Retry original request with new token
                error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosClient(error.config);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
